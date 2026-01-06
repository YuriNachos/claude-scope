# Multi-Line Statusline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Add second line to statusline showing Claude Code configuration counts (CLAUDE.md files, rules, MCPs, hooks) with hybrid caching (5-second interval).

**Architecture:** Multi-line renderer with line-aware widgets. ConfigProvider scans filesystem with hybrid caching (inline cache + 5-second refresh). Widgets declare which line they belong to. Renderer returns array of lines joined by newline.

**Tech Stack:** TypeScript, Node.js fs/promises, Node.js test runner, chai assertions

---

## Task 1: Add line property to IWidget interface

**Files:**
- Modify: `src/core/types.ts`

**Step 1: Update IWidgetMetadata interface**

Add `line` property to widget metadata:

```typescript
export interface IWidgetMetadata {
  name: string;
  description: string;
  /** Which statusline line this widget appears on (0-indexed) */
  line?: number;
}
```

**Step 2: Update createWidgetMetadata helper**

Modify function to accept optional line parameter:

```typescript
export function createWidgetMetadata(
  name: string,
  description: string,
  line: number = 0
): IWidgetMetadata {
  return { name, description, line };
}
```

**Step 3: Verify TypeScript compiles**

Run: `npm run build:tsc`
Expected: No errors

**Step 4: Update existing widget metadata**

Add `line: 0` to all existing widget constructors (ModelWidget, ContextWidget, CostWidget, LinesWidget, DurationWidget, GitWidget, GitChangesWidget).

Example in ModelWidget:
```typescript
readonly metadata = createWidgetMetadata(
  'Model',
  'Current Claude model',
  0  // First line
);
```

**Step 5: Verify build and test**

Run: `npm run build && npm test`
Expected: All tests pass

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add line property to widget metadata

Widgets can now declare which statusline line they appear on.
Defaults to line 0 (first line) for backward compatibility."
```

---

## Task 2: Update Renderer for multi-line support

**Files:**
- Modify: `src/core/renderer.ts`
- Modify: `src/core/types.ts`

**Step 1: Update Renderer.render return type**

Change from returning `string` to `string[]`:

```typescript
async render(widgets: IWidget[], context: RenderContext): Promise<string[]> {
  // Group widgets by line
  const lineMap = new Map<number, IWidget[]>();

  for (const widget of widgets) {
    if (!widget.isEnabled()) {
      continue;
    }

    const line = widget.metadata.line ?? 0;
    if (!lineMap.has(line)) {
      lineMap.set(line, []);
    }
    lineMap.get(line)!.push(widget);
  }

  // Render each line
  const lines: string[] = [];
  const sortedLines = Array.from(lineMap.entries()).sort((a, b) => a[0] - b[0]);

  for (const [, widgetsForLine] of sortedLines) {
    const outputs: string[] = [];

    for (const widget of widgetsForLine) {
      try {
        const output = await widget.render(context);
        if (output !== null) {
          outputs.push(output);
        }
      } catch (error) {
        this.handleError(error as Error, widget);
        if (this.showErrors) {
          outputs.push(`${widget.id}:<err>`);
        }
      }
    }

    const line = outputs.join(this.separator);
    if (line) {
      lines.push(line);
    }
  }

  return lines;
}
```

**Step 2: Update main() to handle array output**

Modify `src/index.ts` main function:

```typescript
// Render (now returns array of lines)
const lines = await renderer.render(
  registry.getEnabledWidgets(),
  { width: 80, timestamp: Date.now() }
);

// Join with newline
return lines.join('\n');
```

**Step 3: Update tryGitFallback to return array**

Modify to return single element array for consistency:

```typescript
const result = await widget.render({ width: 80, timestamp: Date.now() });
return result ? [result] : [];
```

And in main():
```typescript
return fallback.join('\n') || '';
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Clean build

**Step 5: Run integration tests**

Run: `npm run test:integration`
Expected: All integration tests pass (output still single line)

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: update renderer for multi-line support

Renderer now returns array of lines, grouped by widget.line property.
Backward compatible - existing widgets still render on single line."
```

---

## Task 3: Create ConfigProvider for filesystem scanning with caching

**Files:**
- Create: `src/providers/config-provider.ts`

**Step 1: Create the provider file**

Create `src/providers/config-provider.ts` with:

```typescript
/**
 * Config Provider
 *
 * Scans Claude Code configuration files with hybrid caching.
 * Cache invalidates after 5 seconds.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export interface ConfigCounts {
  claudeMdCount: number;
  rulesCount: number;
  mcpCount: number;
  hooksCount: number;
}

export interface ConfigScanOptions {
  cwd?: string;
}

/**
 * Provider for scanning Claude Code configuration with caching
 */
export class ConfigProvider {
  private cachedCounts?: ConfigCounts;
  private lastScan = 0;
  private readonly cacheInterval = 5000; // 5 seconds

  /**
   * Get config counts with hybrid caching
   * Scans filesystem if cache is stale (>5 seconds)
   */
  async getConfigs(options: ConfigScanOptions = {}): Promise<ConfigCounts> {
    const now = Date.now();

    // Return cache if fresh
    if (this.cachedCounts && (now - this.lastScan) < this.cacheInterval) {
      return this.cachedCounts;
    }

    // Scan and update cache
    this.cachedCounts = await this.scanConfigs(options);
    this.lastScan = now;

    return this.cachedCounts;
  }

  /**
   * Scan filesystem for Claude Code configurations
   */
  private async scanConfigs(options: ConfigScanOptions): Promise<ConfigCounts> {
    let claudeMdCount = 0;
    let rulesCount = 0;
    let mcpCount = 0;
    let hooksCount = 0;

    const homeDir = os.homedir();
    const claudeDir = path.join(homeDir, '.claude');
    const cwd = options.cwd;

    // === USER SCOPE ===

    // ~/.claude/CLAUDE.md
    if (await this.fileExists(path.join(claudeDir, 'CLAUDE.md'))) {
      claudeMdCount++;
    }

    // ~/.claude/rules/*.md
    rulesCount += await this.countRulesInDir(path.join(claudeDir, 'rules'));

    // ~/.claude/settings.json
    const userSettings = path.join(claudeDir, 'settings.json');
    const userSettingsData = await this.readJsonFile(userSettings);
    if (userSettingsData) {
      mcpCount += this.countMcpServers(userSettingsData);
      hooksCount += this.countHooks(userSettingsData);
    }

    // ~/.claude.json
    const userClaudeJson = path.join(homeDir, '.claude.json');
    const userClaudeData = await this.readJsonFile(userClaudeJson);
    if (userClaudeData) {
      // Dedupe: subtract MCPs already counted in settings.json
      const userMcpCount = this.countMcpServers(userClaudeData);
      mcpCount += Math.max(0, userMcpCount - this.countMcpServers(userSettingsData || {}));
    }

    // === PROJECT SCOPE ===

    if (cwd) {
      // {cwd}/CLAUDE.md
      if (await this.fileExists(path.join(cwd, 'CLAUDE.md'))) {
        claudeMdCount++;
      }

      // {cwd}/CLAUDE.local.md
      if (await this.fileExists(path.join(cwd, 'CLAUDE.local.md'))) {
        claudeMdCount++;
      }

      // {cwd}/.claude/CLAUDE.md
      if (await this.fileExists(path.join(cwd, '.claude', 'CLAUDE.md'))) {
        claudeMdCount++;
      }

      // {cwd}/.claude/CLAUDE.local.md
      if (await this.fileExists(path.join(cwd, '.claude', 'CLAUDE.local.md'))) {
        claudeMdCount++;
      }

      // {cwd}/.claude/rules/*.md
      rulesCount += await this.countRulesInDir(path.join(cwd, '.claude', 'rules'));

      // {cwd}/.mcp.json
      const mcpJson = path.join(cwd, '.mcp.json');
      const mcpData = await this.readJsonFile(mcpJson);
      if (mcpData) {
        mcpCount += this.countMcpServers(mcpData);
      }

      // {cwd}/.claude/settings.json
      const projectSettings = path.join(cwd, '.claude', 'settings.json');
      const projectSettingsData = await this.readJsonFile(projectSettings);
      if (projectSettingsData) {
        mcpCount += this.countMcpServers(projectSettingsData);
        hooksCount += this.countHooks(projectSettingsData);
      }

      // {cwd}/.claude/settings.local.json
      const localSettings = path.join(cwd, '.claude', 'settings.local.json');
      const localSettingsData = await this.readJsonFile(localSettings);
      if (localSettingsData) {
        mcpCount += this.countMcpServers(localSettingsData);
        hooksCount += this.countHooks(localSettingsData);
      }
    }

    return { claudeMdCount, rulesCount, mcpCount, hooksCount };
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read and parse JSON file
   */
  private async readJsonFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Count MCP servers in config object
   */
  private countMcpServers(config: any): number {
    if (!config || !config.mcpServers || typeof config.mcpServers !== 'object') {
      return 0;
    }
    return Object.keys(config.mcpServers).length;
  }

  /**
   * Count hooks in config object
   */
  private countHooks(config: any): number {
    if (!config || !config.hooks || typeof config.hooks !== 'object') {
      return 0;
    }
    return Object.keys(config.hooks).length;
  }

  /**
   * Recursively count .md files in directory
   */
  private async countRulesInDir(rulesDir: string): Promise<number> {
    const exists = await this.fileExists(rulesDir);
    if (!exists) return 0;

    try {
      let count = 0;
      const entries = await fs.readdir(rulesDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(rulesDir, entry.name);

        if (entry.isDirectory()) {
          count += await this.countRulesInDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          count++;
        }
      }

      return count;
    } catch {
      return 0;
    }
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build:tsc`
Expected: No errors, `dist/providers/config-provider.js` created

**Step 3: Commit**

```bash
git add src/providers/config-provider.ts
git commit -m "feat: add ConfigProvider with hybrid caching

Scans Claude Code config files (CLAUDE.md, rules, MCPs, hooks).
5-second inline cache for performance. Async fs operations."
```

---

## Task 4: Create ConfigCountWidget

**Files:**
- Create: `src/widgets/config-count-widget.ts`

**Step 1: Create the widget file**

Create `src/widgets/config-count-widget.ts` with:

```typescript
/**
 * Config Count Widget
 *
 * Displays Claude Code configuration counts on second statusline line.
 * Data source: ConfigProvider scans filesystem.
 */

import { IWidget } from './core/types.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { ConfigProvider, type ConfigCounts } from '../providers/config-provider.js';
import type { RenderContext, StdinData } from '../types.js';

/**
 * Widget displaying configuration counts
 *
 * Shows: 📄 N CLAUDE.md │ 📜 N rules │ 🔌 N MCPs │ 🪝 N hooks
 * Only appears on line 1 (second line).
 * Hides if all counts are zero.
 */
export class ConfigCountWidget implements IWidget {
  readonly id = 'config-count';
  readonly metadata = createWidgetMetadata(
    'Config Count',
    'Displays Claude Code configuration counts',
    1  // Second line
  );

  private configProvider = new ConfigProvider();
  private configs?: ConfigCounts;
  private cwd?: string;

  async initialize(): Promise<void> {
    // No initialization needed
  }

  async update(data: StdinData): Promise<void> {
    this.cwd = data.cwd;
    this.configs = await this.configProvider.getConfigs({ cwd: data.cwd });
  }

  isEnabled(): boolean {
    // Only show if we have configs AND at least one count > 0
    if (!this.configs) {
      return false;
    }

    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
    return claudeMdCount > 0 || rulesCount > 0 || mcpCount > 0 || hooksCount > 0;
  }

  async render(context: RenderContext): Promise<string | null> {
    if (!this.configs) {
      return null;
    }

    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;

    const parts: string[] = [];

    if (claudeMdCount > 0) {
      parts.push(`📄 ${claudeMdCount} CLAUDE.md`);
    }

    if (rulesCount > 0) {
      parts.push(`📜 ${rulesCount} rules`);
    }

    if (mcpCount > 0) {
      parts.push(`🔌 ${mcpCount} MCPs`);
    }

    if (hooksCount > 0) {
      parts.push(`🪝 ${hooksCount} hooks`);
    }

    return parts.join(' │ ') || null;
  }

  async cleanup(): Promise<void> {
    // No cleanup needed
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build:tsc`
Expected: No errors

**Step 3: Commit**

```bash
git add src/widgets/config-count-widget.ts
git commit -m "feat: add ConfigCountWidget for second line

Shows CLAUDE.md, rules, MCPs, hooks counts.
Hides if all counts are zero. Renders on line 1."
```

---

## Task 5: Create unit tests for ConfigProvider

**Files:**
- Create: `tests/unit/providers/config-provider.test.ts`

**Step 1: Create test fixtures directory structure**

Create temporary test directories:

```bash
mkdir -p tests/fixtures/config-home/.claude/rules
mkdir -p tests/fixtures/config-project/.claude/rules
```

**Step 2: Create the test file**

Create `tests/unit/providers/config-provider.test.ts` with:

```typescript
/**
 * Unit tests for ConfigProvider
 */

import { describe, it, before, after } from 'node:test';
import { expect } from 'chai';
import { rimraf } from 'rimraf';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { ConfigProvider } from '../../../src/providers/config-provider.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testHomeDir = path.join(__dirname, '../fixtures/config-home');
const testProjectDir = path.join(__dirname, '../fixtures/config-project');

describe('ConfigProvider', () => {
  let originalHome: string;

  before(async () => {
    // Store original HOME
    originalHome = process.env.HOME || '';

    // Create test home structure
    await fs.mkdir(path.join(testHomeDir, '.claude', 'rules'), { recursive: true });
    await fs.writeFile(path.join(testHomeDir, '.claude', 'CLAUDE.md'), '# User CLAUDE.md');
    await fs.writeFile(path.join(testHomeDir, '.claude', 'rules', 'rule1.md'), '# Rule 1');
    await fs.writeFile(path.join(testHomeDir, '.claude', 'rules', 'rule2.md'), '# Rule 2');
    await fs.writeFile(
      path.join(testHomeDir, '.claude', 'settings.json'),
      JSON.stringify({
        mcpServers: { mcp1: { command: 'node', args: ['server.js'] } },
        hooks: { 'pre-commit': 'echo "pre-commit"' }
      })
    );

    // Create test project structure
    await fs.mkdir(path.join(testProjectDir, '.claude', 'rules'), { recursive: true });
    await fs.writeFile(path.join(testProjectDir, 'CLAUDE.md'), '# Project CLAUDE.md');
    await fs.writeFile(path.join(testProjectDir, '.claude', 'rules', 'rule3.md'), '# Rule 3');
    await fs.writeFile(
      path.join(testProjectDir, '.claude', 'settings.json'),
      JSON.stringify({
        mcpServers: { mcp2: { command: 'python', args: ['server.py'] } }
      })
    );
  });

  after(async () => {
    // Restore original HOME
    process.env.HOME = originalHome;

    // Cleanup test directories
    await rimraf(testHomeDir);
    await rimraf(testProjectDir);
  });

  it('should count user-scope configs', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs();

    expect(configs.claudeMdCount).to.equal(1);
    expect(configs.rulesCount).to.equal(2);
    expect(configs.mcpCount).to.equal(1);
    expect(configs.hooksCount).to.equal(1);
  });

  it('should count project-scope configs', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ cwd: testProjectDir });

    expect(configs.claudeMdCount).to.equal(2); // 1 user + 1 project
    expect(configs.rulesCount).to.equal(3); // 2 user + 1 project
    expect(configs.mcpCount).to.equal(2); // 1 user + 1 project
  });

  it('should use cache with 5-second interval', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();

    const first = await provider.getConfigs();
    // Add new file (should not be counted due to cache)
    await fs.writeFile(path.join(testHomeDir, '.claude', 'CLAUDE.local.md'), '# Local');

    const second = await provider.getConfigs();
    expect(second).to.deep.equal(first); // Cache hit

    // Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 5100));

    const third = await provider.getConfigs();
    expect(third.claudeMdCount).to.be.greaterThan(first.claudeMdCount); // Cache miss
  });

  it('should return zeros when no configs exist', async () => {
    process.env.HOME = '/tmp/nonexistent';
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs();

    expect(configs.claudeMdCount).to.equal(0);
    expect(configs.rulesCount).to.equal(0);
    expect(configs.mcpCount).to.equal(0);
    expect(configs.hooksCount).to.equal(0);
  });

  it('should handle missing project directory', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ cwd: '/tmp/nonexistent' });

    // Should still return user-scope configs
    expect(configs.claudeMdCount).to.equal(1);
  });
});
```

**Step 3: Install rimraf dev dependency**

Run: `npm install --save-dev rimraf`
Expected: package.json updated

**Step 4: Run the tests**

Run: `npm test -- tests/unit/providers/config-provider.test.ts`
Expected: All 5 tests PASS

**Step 5: Commit**

```bash
git add tests/ package.json
git commit -m "test: add ConfigProvider unit tests

Test coverage:
- User-scope config counting
- Project-scope config counting
- 5-second cache behavior
- Missing configs handling
- Edge cases"
```

---

## Task 6: Create unit tests for ConfigCountWidget

**Files:**
- Create: `tests/unit/widgets/config-count-widget.test.ts`

**Step 1: Create the test file**

Create `tests/unit/widgets/config-count-widget.test.ts` with:

```typescript
/**
 * Unit tests for ConfigCountWidget
 */

import { describe, it, before, after } from 'node:test';
import { expect } from 'chai';
import { rimraf } from 'rimraf';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { ConfigCountWidget } from '../../../src/widgets/config-count-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testHomeDir = path.join(__dirname, '../fixtures/config-home');
const testProjectDir = path.join(__dirname, '../fixtures/config-project');

describe('ConfigCountWidget', () => {
  let originalHome: string;

  before(async () => {
    originalHome = process.env.HOME || '';

    // Create minimal test structure
    await fs.mkdir(path.join(testHomeDir, '.claude'), { recursive: true });
    await fs.writeFile(path.join(testHomeDir, '.claude', 'CLAUDE.md'), '# User');
    await fs.mkdir(path.join(testProjectDir, '.claude'), { recursive: true });
    await fs.writeFile(path.join(testProjectDir, 'CLAUDE.md'), '# Project');
  });

  after(async () => {
    process.env.HOME = originalHome;
    await rimraf(testHomeDir);
    await rimraf(testProjectDir);
  });

  it('should have correct id and metadata', () => {
    const widget = new ConfigCountWidget();
    expect(widget.id).to.equal('config-count');
    expect(widget.metadata.name).to.equal('Config Count');
    expect(widget.metadata.line).to.equal(1);
  });

  it('should be disabled when all counts are zero', async () => {
    process.env.HOME = '/tmp/nonexistent';
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: '/tmp/nonexistent' }));

    expect(widget.isEnabled()).to.be.false;
  });

  it('should be enabled when at least one count > 0', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testProjectDir }));

    expect(widget.isEnabled()).to.be.true;
  });

  it('should render with icons and labels', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testProjectDir }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('📄');
    expect(result).to.include('CLAUDE.md');
  });

  it('should not show categories with zero count', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testHomeDir })); // Only user, no project

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Should not show MCPs or hooks if they don't exist
    expect(result).to.not.include('🔌');
    expect(result).to.not.include('🪝');
  });

  it('should use separator between items', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testProjectDir }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include(' │ ');
  });
});
```

**Step 2: Run the tests**

Run: `npm test -- tests/unit/widgets/config-count-widget.test.ts`
Expected: All 6 tests PASS

**Step 3: Commit**

```bash
git add tests/unit/widgets/config-count-widget.test.ts
git commit -m "test: add ConfigCountWidget unit tests

Test coverage:
- Metadata verification
- Enable/disable logic based on counts
- Rendering with icons and labels
- Zero-count categories hidden
- Separator between items"
```

---

## Task 7: Integrate ConfigCountWidget into main entry point

**Files:**
- Modify: `src/index.ts`

**Step 1: Add import statement**

Add after line 15 (after GitChangesWidget import):

```typescript
import { ConfigCountWidget } from './widgets/config-count-widget.js';
```

**Step 2: Register widget**

After line 60 (after GitChangesWidget registration), add:

```typescript
await registry.register(new ConfigCountWidget());
```

The widget registration section should now look like:

```typescript
// Register all widgets (no constructor args needed)
await registry.register(new ModelWidget());
await registry.register(new ContextWidget());
await registry.register(new CostWidget());
await registry.register(new LinesWidget());
await registry.register(new DurationWidget());
await registry.register(new GitWidget());
await registry.register(new GitChangesWidget());
await registry.register(new ConfigCountWidget());  // Second line
```

**Step 3: Verify build**

Run: `npm run build`
Expected: No errors, bundled file created successfully

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: integrate ConfigCountWidget into statusline

Adds ConfigCountWidget to main registry.
New output: two lines - main statusline + config counts."
```

---

## Task 8: Update integration tests for multi-line output

**Files:**
- Modify: `tests/integration/five-widgets.integration.test.ts`
- Modify: `tests/integration/cli-flow.integration.test.ts`

**Step 1: Update five-widgets integration test**

Open `tests/integration/five-widgets.integration.test.ts` and update:

1. Add import at top with other widget imports:
```typescript
import { ConfigCountWidget } from '../../src/widgets/config-count-widget.js';
```

2. Register the widget in the test setup:
```typescript
await registry.register(new ConfigCountWidget());
```

3. Update expected output to handle array:
```typescript
const output = await renderer.render(registry.getEnabledWidgets(), { width: 80, timestamp: 0 });

// Should now have 2 lines
expect(Array.isArray(output)).to.be.true;
```

**Step 2: Update cli-flow integration test**

Open `tests/integration/cli-flow.integration.test.ts` and update:

1. Add import:
```typescript
import { ConfigCountWidget } from '../../src/widgets/config-count-widget.js';
```

2. Register widget in test setup

3. Update assertions for multi-line output (split by \n)

**Step 3: Run integration tests**

Run: `npm run test:integration`
Expected: All integration tests PASS

**Step 4: Commit**

```bash
git add tests/integration/
git commit -m "test: update integration tests for multi-line output

Integration tests now expect array of lines from renderer.
ConfigCountWidget added to test setup."
```

---

## Task 9: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update version**

Change line 3 from:
```markdown
**Current version**: v0.2.5
```

To:
```markdown
**Current version**: v0.3.0
```

**Step 2: Add multi-line statusline to implemented features**

After the line "- Git branch and changes display", add:
```markdown
- Multi-line statusline (config counts on second line)
```

After "- Lines added/removed display", add:
```markdown
- Configuration counts (CLAUDE.md, rules, MCPs, hooks)
```

**Step 3: Add ConfigCountWidget to file structure**

In the file structure section, after `- lines-widget.ts`, add:
```markdown
- config-count-widget.ts
```

Add new section after providers section:
```markdown
├── providers/
│   ├── git-provider.ts       # Git operations wrapper (IGit interface)
│   └── config-provider.ts    # Claude Code config scanner with caching
```

**Step 4: Update widget interface documentation**

Add line property to IWidget interface documentation:
```markdown
interface IWidget {
  readonly id: string;
  readonly metadata: IWidgetMetadata;  // Includes line property for multi-line support
  ...
}
```

**Step 5: Verify documentation**

Run: `head -40 CLAUDE.md` to verify changes

**Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for v0.3.0

Added multi-line statusline and ConfigCountWidget features.
Updated file structure and widget interface docs."
```

---

## Task 10: Bump version to 0.3.0

**Files:**
- Modify: `package.json`

**Step 1: Update version**

Change line 3 from:
```json
"version": "0.2.5",
```

To:
```json
"version": "0.3.0",
```

**Step 2: Verify package.json is valid**

Run: `cat package.json | jq .version` (or just `grep version package.json`)
Expected: `"version": "0.3.0"`

**Step 3: Build to verify**

Run: `npm run build`
Expected: Clean build with no errors

**Step 4: Commit**

```bash
git add package.json
git commit -m "chore: bump version to 0.3.0"
```

---

## Task 11: Run full test suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests PASS (unit, integration, e2e)

**Step 2: Run with coverage**

Run: `npm run test:coverage`
Expected: Coverage report generated, check ConfigProvider and ConfigCountWidget have good coverage

**Step 3: Build production bundle**

Run: `npm run build`
Expected: `dist/claude-scope.cjs` created successfully

**Step 4: Manual smoke test**

Run: `echo '{}' | node dist/index.js`
Expected: No errors, may show git fallback only

---

## Task 12: Create git tag and push

**Step 1: Create annotated tag**

```bash
git tag -a v0.3.0 -m "v0.3.0: Multi-line statusline with config counts

- Add second line showing CLAUDE.md, rules, MCPs, hooks counts
- ConfigProvider with 5-second hybrid caching
- Multi-line renderer supporting widget.line property
- Adaptive display: hides second line if all counts are zero"
```

**Step 2: Push commits and tags**

```bash
git push origin main
git push origin v0.3.0
```

**Step 3: Wait for CI**

Monitor CI workflow:
```bash
gh run watch
```

Expected: CI builds, commits dist/, publishes to npm

**Step 4: Verify on GitHub**

Check that the release was created and CI/CD pipeline completed

---

## Task 13: Local testing and verification

**Step 1: Install latest version from npm**

```bash
npm install -g claude-scope@latest
```

Or install locally after CI completes:
```bash
cd /tmp/claude-scope && npm install -g .
```

**Step 2: Create test configuration**

```bash
# Create test CLAUDE.md
echo "# Test Project" > CLAUDE.md

# Create test rules
mkdir -p .claude/rules
echo "# Rule 1" > .claude/rules/test.md

# Create test MCP config
echo '{"mcpServers":{"test":{"command":"echo"}}}' > .claude/settings.json
```

**Step 3: Test in Claude Code**

Open Claude Code and verify the statusline shows two lines:

```
Claude Opus 4.5 │ [████████████░░░░░░░░░░] 60% │ $0.0145 │ +123/-45 │ 2m 15s │ main
📄 1 CLAUDE.md │ 📜 1 rules │ 🔌 1 MCPs
```

**Step 4: Verify cache behavior**

- First render: scans filesystem
- Within 5 seconds: uses cache (fast)
- After 5 seconds: re-scans

**Step 5: Verify adaptive display**

Remove all configs:
```bash
rm CLAUDE.md
rm -rf .claude
```

Expected: Second line disappears (only first line shown)

---

## Summary

After completing all tasks:
- ✅ Multi-line renderer with widget.line property
- ✅ ConfigProvider with 5-second hybrid caching
- ✅ ConfigCountWidget showing CLAUDE.md, rules, MCPs, hooks
- ✅ Full test coverage (11 new tests)
- ✅ Integration tests updated for multi-line output
- ✅ Documentation updated to v0.3.0
- ✅ Version bumped to 0.3.0
- ✅ Git tag created and pushed
- ✅ Published to NPM (via CI/CD)
- ✅ Locally installed and verified

**Total commits:** 13 atomic commits
**Total tests:** 11 new tests (5 ConfigProvider + 6 ConfigCountWidget)
**New files:** 2 (config-provider.ts, config-count-widget.ts)
**Modified files:** 5 (types.ts, renderer.ts, index.ts, CLAUDE.md, package.json)
