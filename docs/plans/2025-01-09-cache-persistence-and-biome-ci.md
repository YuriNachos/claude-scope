# Cache Persistence and Biome CI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement file-based cache persistence to prevent widget value flickering, and set up proper Biome formatting with pre-commit hooks and CI integration.

**Architecture:**
1. **Cache Persistence**: Create a `CacheManager` class that stores last valid `current_usage` values in a JSON file at `~/.config/claude-scope/cache.json`. Widgets will use cached values when `current_usage` is null, with 5-minute expiry.
2. **Biome Integration**: Remove Biome from Claude Code hooks, set up husky + lint-staged for pre-commit auto-fix, and add `biome ci` check to GitHub Actions CI pipeline.

**Tech Stack:** TypeScript, Node.js native fs module, husky, lint-staged, GitHub Actions

---

## Task 1: Create CacheManager Class

**Files:**
- Create: `src/storage/cache-manager.ts`
- Create: `src/storage/types.ts`
- Test: `tests/unit/storage/cache-manager.test.ts`

**Step 1: Create storage types**

Write `src/storage/types.ts`:

```typescript
/**
 * Storage types for cache persistence
 */

/** Cached context usage data */
export interface CachedContextUsage {
  /** Timestamp when cached (ms since epoch) */
  timestamp: number;
  /** Context usage data */
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
  };
}

/** Cache file structure */
export interface CacheFile {
  /** Per-session cached data, keyed by session_id */
  sessions: Record<string, CachedContextUsage>;
  /** Cache version for migration */
  version: 1;
}

/** Cache manager options */
export interface CacheManagerOptions {
  /** Cache file path */
  cachePath: string;
  /** Cache expiry time in milliseconds (default: 5 minutes) */
  expiryMs?: number;
}
```

**Step 2: Create CacheManager class**

Write `src/storage/cache-manager.ts`:

```typescript
/**
 * Cache Manager for persisting widget state
 *
 * Stores last valid context_usage values to prevent flickering
 * when Claude Code sends null current_usage during tool execution.
 */

import type { CacheFile, CacheManagerOptions, CachedContextUsage } from "./types.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { homedir } from "node:os";

const DEFAULT_CACHE_PATH = `${homedir()}/.config/claude-scope/cache.json`;
const DEFAULT_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export class CacheManager {
  private cachePath: string;
  private expiryMs: number;

  constructor(options?: Partial<CacheManagerOptions>) {
    this.cachePath = options?.cachePath ?? DEFAULT_CACHE_PATH;
    this.expiryMs = options?.expiryMs ?? DEFAULT_EXPIRY_MS;

    // Ensure cache directory exists
    this.ensureCacheDir();
  }

  /**
   * Get cached usage data for a session
   * @param sessionId - Session identifier
   * @returns Cached usage if valid and not expired, null otherwise
   */
  getCachedUsage(sessionId: string): CachedContextUsage | null {
    const cache = this.loadCache();
    const cached = cache.sessions[sessionId];

    if (!cached) {
      return null;
    }

    // Check expiry
    const age = Date.now() - cached.timestamp;
    if (age > this.expiryMs) {
      // Remove expired entry
      delete cache.sessions[sessionId];
      this.saveCache(cache);
      return null;
    }

    return cached;
  }

  /**
   * Store usage data for a session
   * @param sessionId - Session identifier
   * @param usage - Context usage data to cache
   */
  setCachedUsage(sessionId: string, usage: CachedContextUsage["usage"]): void {
    const cache = this.loadCache();

    cache.sessions[sessionId] = {
      timestamp: Date.now(),
      usage,
    };

    this.saveCache(cache);
  }

  /**
   * Clear all cached data (useful for testing)
   */
  clearCache(): void {
    const emptyCache: CacheFile = {
      sessions: {},
      version: 1,
    };
    this.saveCache(emptyCache);
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpired(): void {
    const cache = this.loadCache();
    const now = Date.now();

    for (const [sessionId, cached] of Object.entries(cache.sessions)) {
      const age = now - cached.timestamp;
      if (age > this.expiryMs) {
        delete cache.sessions[sessionId];
      }
    }

    this.saveCache(cache);
  }

  /**
   * Load cache from file
   */
  private loadCache(): CacheFile {
    if (!existsSync(this.cachePath)) {
      return { sessions: {}, version: 1 };
    }

    try {
      const content = readFileSync(this.cachePath, "utf-8");
      return JSON.parse(content) as CacheFile;
    } catch {
      return { sessions: {}, version: 1 };
    }
  }

  /**
   * Save cache to file
   */
  private saveCache(cache: CacheFile): void {
    try {
      writeFileSync(this.cachePath, JSON.stringify(cache, null, 2), "utf-8");
    } catch {
      // Fail silently - cache is optional
    }
  }

  /**
   * Ensure cache directory exists
   */
  private ensureCacheDir(): void {
    try {
      const dir = dirname(this.cachePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    } catch {
      // Fail silently - cache is optional
    }
  }
}
```

**Step 3: Write tests for CacheManager**

Write `tests/unit/storage/cache-manager.test.ts`:

```typescript
/**
 * CacheManager Unit Tests
 */

import { unlinkSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { CacheManager } from "../../../src/storage/cache-manager.js";

describe("CacheManager", () => {
  const testCachePath = join(tmpdir(), `test-cache-${Date.now()}.json`);
  let manager: CacheManager;

  beforeEach(() => {
    // Create fresh manager for each test
    manager = new CacheManager({ cachePath: testCachePath });
  });

  afterEach(() => {
    // Clean up test cache file
    if (existsSync(testCachePath)) {
      try {
        unlinkSync(testCachePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe("getCachedUsage", () => {
    it("should return null for non-existent session", () => {
      const result = manager.getCachedUsage("non-existent");
      assert.strictEqual(result, null);
    });

    it("should return cached usage for valid session", () => {
      const sessionId = "test-session";
      const usage = {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      };

      manager.setCachedUsage(sessionId, usage);
      const result = manager.getCachedUsage(sessionId);

      assert.notStrictEqual(result, null);
      assert.strictEqual(result?.usage.input_tokens, 100);
      assert.strictEqual(result?.usage.cache_read_input_tokens, 1000);
    });

    it("should return null for expired cache", () => {
      const sessionId = "test-session";
      const usage = {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      };

      // Create manager with very short expiry
      const shortExpiryManager = new CacheManager({
        cachePath: testCachePath,
        expiryMs: 10, // 10ms expiry
      });

      shortExpiryManager.setCachedUsage(sessionId, usage);

      // Wait for expiry
      const startTime = Date.now();
      while (Date.now() - startTime < 20) {
        // Busy wait for 20ms
      }

      const result = shortExpiryManager.getCachedUsage(sessionId);
      assert.strictEqual(result, null);
    });
  });

  describe("setCachedUsage", () => {
    it("should store usage data with timestamp", () => {
      const sessionId = "test-session";
      const usage = {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      };

      const beforeTimestamp = Date.now();
      manager.setCachedUsage(sessionId, usage);
      const afterTimestamp = Date.now();

      const result = manager.getCachedUsage(sessionId);

      assert.notStrictEqual(result, null);
      assert.ok(result!.timestamp >= beforeTimestamp);
      assert.ok(result!.timestamp <= afterTimestamp);
    });

    it("should overwrite existing cache for same session", () => {
      const sessionId = "test-session";

      manager.setCachedUsage(sessionId, {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      });

      manager.setCachedUsage(sessionId, {
        input_tokens: 200, // Different value
        output_tokens: 75,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 2000,
      });

      const result = manager.getCachedUsage(sessionId);
      assert.strictEqual(result?.usage.input_tokens, 200);
      assert.strictEqual(result?.usage.cache_read_input_tokens, 2000);
    });
  });

  describe("clearCache", () => {
    it("should remove all cached sessions", () => {
      manager.setCachedUsage("session-1", {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      });

      manager.setCachedUsage("session-2", {
        input_tokens: 200,
        output_tokens: 75,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 2000,
      });

      manager.clearCache();

      assert.strictEqual(manager.getCachedUsage("session-1"), null);
      assert.strictEqual(manager.getCachedUsage("session-2"), null);
    });
  });

  describe("cleanupExpired", () => {
    it("should remove only expired sessions", () => {
      const shortExpiryManager = new CacheManager({
        cachePath: testCachePath,
        expiryMs: 100,
      });

      shortExpiryManager.setCachedUsage("old-session", {
        input_tokens: 100,
        output_tokens: 50,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 1000,
      });

      // Wait for expiry
      const startTime = Date.now();
      while (Date.now() - startTime < 150) {
        // Busy wait for 150ms
      }

      shortExpiryManager.setCachedUsage("new-session", {
        input_tokens: 200,
        output_tokens: 75,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 2000,
      });

      shortExpiryManager.cleanupExpired();

      assert.strictEqual(shortExpiryManager.getCachedUsage("old-session"), null);
      assert.notStrictEqual(shortExpiryManager.getCachedUsage("new-session"), null);
    });
  });
});
```

**Step 4: Run tests to verify**

Run: `npm test tests/unit/storage/cache-manager.test.ts`
Expected: All tests pass

**Step 5: Commit**

```bash
git add src/storage/cache-manager.ts src/storage/types.ts tests/unit/storage/cache-manager.test.ts
git commit -m "feat(storage): add CacheManager for widget state persistence"
```

---

## Task 2: Update ContextWidget to Use Cache

**Files:**
- Modify: `src/widgets/context-widget.ts`

**Step 1: Modify ContextWidget to use cached values**

Replace the entire `src/widgets/context-widget.ts` with:

```typescript
/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 * Uses cached values when current_usage is null to prevent flickering
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IContextColors, IThemeColors } from "../ui/theme/types.js";
import { contextStyles } from "./context/styles.js";
import type { ContextRenderData } from "./context/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { CacheManager } from "../storage/cache-manager.js";

export class ContextWidget extends StdinDataWidget {
  readonly id = "context";
  readonly metadata = createWidgetMetadata(
    "Context",
    "Displays context window usage with progress bar",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private colors: IThemeColors;
  private styleFn: StyleRendererFn<ContextRenderData, IContextColors> = contextStyles.balanced!;
  private cacheManager: CacheManager;
  private cachedRenderData?: ContextRenderData;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
    this.cacheManager = new CacheManager();
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = contextStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  /**
   * Update widget with new data, storing valid values in cache
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    const { current_usage, context_window_size } = data.context_window;

    // If we have valid current_usage, cache it
    if (current_usage) {
      this.cacheManager.setCachedUsage(data.session_id, {
        input_tokens: current_usage.input_tokens,
        output_tokens: current_usage.output_tokens,
        cache_creation_input_tokens: current_usage.cache_creation_input_tokens,
        cache_read_input_tokens: current_usage.cache_read_input_tokens,
      });
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const { current_usage, context_window_size } = data.context_window;

    // Try to get usage data: prefer current, fall back to cache
    let usage = current_usage;
    if (!usage) {
      const cached = this.cacheManager.getCachedUsage(data.session_id);
      if (cached) {
        usage = cached.usage;
      }
    }

    if (!usage) return null;

    // Calculate actual context usage
    const used =
      usage.input_tokens +
      usage.cache_creation_input_tokens +
      usage.cache_read_input_tokens +
      usage.output_tokens;

    const percent = Math.round((used / context_window_size) * 100);

    const renderData = {
      used,
      contextWindowSize: context_window_size,
      percent,
    };

    // Cache render data for potential reuse
    this.cachedRenderData = renderData;

    return this.styleFn(renderData, this.colors.context);
  }

  isEnabled(): boolean {
    return this.cachedRenderData !== undefined || this.data !== null;
  }
}
```

**Step 2: Write tests for cached behavior**

Add to `tests/unit/widgets/context-widget.test.ts`:

```typescript
describe("cache persistence", () => {
  it("should use cached values when current_usage is null", async () => {
    const widget = new ContextWidget();

    // First update with valid data
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 100,
          output_tokens: 50,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 1000,
        }
      }
    }));

    const result1 = await widget.render({ width: 80, timestamp: 0 });
    assert.ok(result1);

    // Second update with null current_usage (simulating tool execution)
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: null,
      }
    }));

    const result2 = await widget.render({ width: 80, timestamp: 0 });
    // Should still render using cached values
    assert.ok(result2);
    assert.strictEqual(result1, result2); // Same output from cache
  });

  it("should return null when no cache and current_usage is null", async () => {
    const widget = new ContextWidget();

    // Update with null current_usage (no cache available)
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: null,
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });
    assert.strictEqual(result, null);
  });
});
```

**Step 3: Run tests to verify**

Run: `npm test tests/unit/widgets/context-widget.test.ts`
Expected: All tests pass (including new cache tests)

**Step 4: Commit**

```bash
git add src/widgets/context-widget.ts tests/unit/widgets/context-widget.test.ts
git commit -m "feat(context): use cached values when current_usage is null"
```

---

## Task 3: Update CacheMetricsWidget to Use Cache

**Files:**
- Modify: `src/widgets/cache-metrics/cache-metrics-widget.ts`
- Test: `tests/unit/widgets/cache-metrics-widget.test.ts`

**Step 1: Modify CacheMetricsWidget to use cached values**

Replace the `calculateMetrics` and `update` methods in `src/widgets/cache-metrics/cache-metrics-widget.ts`:

```typescript
/**
 * Cache Metrics Widget
 *
 * Displays cache hit rate and savings from context usage data
 * Uses cached values when current_usage is null to prevent flickering
 */

import { createWidgetMetadata } from "../../core/widget-types.js";
import type { RenderContext, StdinData } from "../../types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import { cacheMetricsStyles } from "./styles.js";
import type { CacheMetricsRenderData, CacheMetricsStyle } from "./types.js";
import { CacheManager } from "../../storage/cache-manager.js";

export class CacheMetricsWidget extends StdinDataWidget {
  readonly id = "cache-metrics";
  readonly metadata = createWidgetMetadata(
    "Cache Metrics",
    "Cache hit rate and savings display",
    "1.0.0",
    "claude-scope",
    2 // Third line
  );

  private theme: IThemeColors;
  private style: CacheMetricsStyle = "balanced";
  private renderData?: CacheMetricsRenderData;
  private cacheManager: CacheManager;

  constructor(theme?: IThemeColors) {
    super();
    this.theme = theme ?? DEFAULT_THEME;
    this.cacheManager = new CacheManager();
  }

  /**
   * Set display style
   */
  setStyle(style: CacheMetricsStyle): void {
    this.style = style;
  }

  /**
   * Calculate cache metrics from context usage data
   * Returns null if no usage data is available (current or cached)
   */
  private calculateMetrics(data: StdinData): CacheMetricsRenderData | null {
    let usage = data.context_window?.current_usage;

    // Fall back to cache if current_usage is null
    if (!usage) {
      const cached = this.cacheManager.getCachedUsage(data.session_id);
      if (cached) {
        usage = cached.usage;
      }
    }

    if (!usage) {
      return null;
    }

    const cacheRead = usage.cache_read_input_tokens ?? 0;
    const cacheWrite = usage.cache_creation_input_tokens ?? 0;
    const inputTokens = usage.input_tokens ?? 0;
    const outputTokens = usage.output_tokens ?? 0;

    // FIX: Total input tokens = cache read + cache write + new input tokens
    const totalInputTokens = cacheRead + cacheWrite + inputTokens;
    const totalTokens = totalInputTokens + outputTokens;

    // Cache hit rate = cache read / total input tokens (capped at 100%)
    const hitRate =
      totalInputTokens > 0 ? Math.min(100, Math.round((cacheRead / totalInputTokens) * 100)) : 0;

    // Cost savings: cache costs 10% of regular tokens
    const costPerToken = 0.000003;
    const savings = cacheRead * 0.9 * costPerToken;

    return {
      cacheRead,
      cacheWrite,
      totalTokens,
      hitRate,
      savings,
    };
  }

  /**
   * Update widget with new data and calculate metrics
   * Stores valid usage data in cache for future use
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    // Store valid current_usage in cache
    const usage = data.context_window?.current_usage;
    if (usage) {
      this.cacheManager.setCachedUsage(data.session_id, {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens,
        cache_read_input_tokens: usage.cache_read_input_tokens,
      });
    }

    const metrics = this.calculateMetrics(data);
    this.renderData = metrics ?? undefined;
  }

  /**
   * Render the cache metrics display
   */
  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    if (!this.renderData) {
      return null;
    }

    const styleFn = cacheMetricsStyles[this.style] ?? cacheMetricsStyles.balanced;
    if (!styleFn) {
      return null;
    }
    return styleFn(this.renderData, this.theme);
  }

  /**
   * Widget is enabled when we have cache metrics data
   */
  isEnabled(): boolean {
    return this.renderData !== undefined;
  }
}
```

**Step 2: Write tests for cached behavior**

Add to `tests/unit/widgets/cache-metrics-widget.test.ts`:

```typescript
describe("cache persistence", () => {
  it("should use cached values when current_usage is null", async () => {
    const widget = new CacheMetricsWidget();

    // First update with valid data
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 100,
          output_tokens: 50,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 1000,
        }
      }
    }));

    const result1 = await widget.render({ width: 80, timestamp: 0 });
    assert.ok(result1);
    assert.ok(result1.includes("100")); // cache read amount

    // Second update with null current_usage
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: null,
      }
    }));

    const result2 = await widget.render({ width: 80, timestamp: 0 });
    // Should still render using cached values
    assert.ok(result2);
    assert.ok(result2.includes("100"));
  });

  it("should return null when no cache and current_usage is null", async () => {
    const widget = new CacheMetricsWidget();

    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: null,
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });
    assert.strictEqual(result, null);
  });
});
```

**Step 3: Run tests to verify**

Run: `npm test tests/unit/widgets/cache-metrics-widget.test.ts`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/widgets/cache-metrics/cache-metrics-widget.ts tests/unit/widgets/cache-metrics-widget.test.ts
git commit -m "feat(cache-metrics): use cached values when current_usage is null"
```

---

## Task 4: Add Storage Export to Main Entry

**Files:**
- Modify: `src/index.ts` (if needed for exports)

**Step 1: Verify storage module exports**

Check `src/storage/types.ts` has proper export (already done in Task 1).

**Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 3: Commit (if any changes needed)**

```bash
git add src/index.ts
git commit -m "chore: export storage module types"
```

---

## Task 5: Install and Configure Husky and lint-staged

**Files:**
- Modify: `package.json`
- Create: `.husky/pre-commit`

**Step 1: Install dependencies**

Run: `npm install --save-dev husky lint-staged`
Expected: Packages installed successfully

**Step 2: Initialize husky**

Run: `npx husky init`
Expected: Creates `.husky` directory with `pre-commit` hook

**Step 3: Update package.json scripts**

Add to `package.json`:

```json
{
  "scripts": {
    "prepare": "husky",
    "lint": "biome check .",
    "lint:fix": "biome check --write ."
  },
  "lint-staged": {
    "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
      "biome check --write --no-errors-on-unmatched --files-ignore-unknown=true"
    ]
  }
}
```

**Step 4: Update .husky/pre-commit**

Replace `.husky/pre-commit` content with:

```bash
npx lint-staged
```

**Step 5: Remove Biome from Claude Code hooks**

Edit `.claude/settings.json`, remove the `PostToolUse` entry for format-ts.sh:

**Before:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/format-ts.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

**After:**
```json
{
  "PostToolUse": []
}
```

**Step 6: Test pre-commit hook**

Run: `git add . && git commit -m "test: verify pre-commit hook runs"`
Expected: Biome runs and auto-fixes any formatting issues

**Step 7: Commit**

```bash
git add package.json package-lock.json .husky/pre-commit .claude/settings.json
git commit -m "feat(ci): add husky pre-commit hooks with lint-staged"
```

---

## Task 6: Add Biome Check to CI Pipeline

**Files:**
- Modify: `.github/workflows/release.yml`

**Step 1: Add Biome setup and check step**

Insert before the "Build" step in `.github/workflows/release.yml`:

```yaml
      - name: Setup Biome
        uses: biomejs/setup-biome@v2
        with:
          version: latest

      - name: Check code formatting
        run: biome ci .
```

**Full updated release.yml (relevant section):**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Biome
        uses: biomejs/setup-biome@v2
        with:
          version: latest

      - name: Check code formatting
        run: biome ci .

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Coverage
        run: npm run test:coverage

      - name: Build
        run: npm run build
```

**Step 2: Verify workflow syntax**

Run: `cat .github/workflows/release.yml`
Expected: Valid YAML with Biome steps before build

**Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "feat(ci): add Biome formatting check to CI pipeline"
```

---

## Task 7: Update Biome Configuration (if needed)

**Files:**
- Check: `biome.json`

**Step 1: Verify Biome config**

Ensure `biome.json` has proper configuration:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules/", "dist/"]
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

**Step 2: Run Biome check to verify**

Run: `npx biome check .`
Expected: No errors (or auto-fixable issues)

**Step 3: Fix any issues**

Run: `npx biome check --write .`

**Step 4: Commit (if changes)**

```bash
git add biome.json src/
git commit -m "chore: update Biome configuration"
```

---

## Task 8: Run Full Test Suite and Verification

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 2: Run Biome check**

Run: `npx biome ci .`
Expected: No formatting issues

**Step 3: Test cache persistence manually**

Create a test script to verify caching works:

Run: `node -e "
const { CacheManager } = require('./dist/storage/cache-manager.js');
const manager = new CacheManager();
manager.setCachedUsage('test-session', { input_tokens: 100, output_tokens: 50, cache_creation_input_tokens: 0, cache_read_input_tokens: 1000 });
const cached = manager.getCachedUsage('test-session');
console.log('Cached:', JSON.stringify(cached));
manager.clearCache();
"`
Expected: Shows cached data, then clears it

**Step 4: Commit**

```bash
git commit --allow-empty -m "test: verify all implementations pass"
```

---

## Task 9: Create Patch Version and Release

**Step 1: Run final verification**

Run: `npm test && npx biome ci .`
Expected: All pass

**Step 2: Increment patch version**

Run: `npm version patch`
Expected: Version bumped (v0.6.11 → v0.6.12)

**Step 3: Commit version bump**

(Already done by npm version)

**Step 4: Push to GitHub**

Run: `git push && git push --tags`

**Step 5: Monitor CI**

Run: `gh run watch`
Expected: CI runs with new Biome check, all pass

**Step 6: Pull dist files**

Run: `git pull origin main`
Expected: Gets `dist/` files from CI build

**Step 7: Install locally**

Run: `npm install -g claude-scope@latest`

**Step 8: Verify installation**

Run: `claude-scope --version`
Expected: Shows new version

---

## Task 10: Final Verification and Documentation

**Step 1: Create summary documentation**

Write brief notes in CLAUDE.md or create docs/cache-persistence.md:

```markdown
## Cache Persistence

Widgets now cache `current_usage` values to prevent flickering when Claude Code sends null during tool execution.

- Cache location: `~/.config/claude-scope/cache.json`
- Cache expiry: 5 minutes
- Affected widgets: ContextWidget, CacheMetricsWidget

## Code Quality

- Pre-commit hooks: Husky + lint-staged with Biome
- CI: GitHub Actions runs `biome ci` before tests
- Removed: Biome from Claude Code hooks (redundant)
```

**Step 2: Final commit**

```bash
git add CLAUDE.md docs/
git commit -m "docs: document cache persistence and CI changes"
```

---

## Execution Handoff

This plan is complete and ready for implementation.

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Manual Implementation (this session)** - I implement each task step-by-step directly with atomic commits

**Which approach?**

(Recommendation: Manual implementation for straightforward tasks with clear steps)
