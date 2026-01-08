# Widget Display Styles System — Phase 2: Utility Functions (Detailed)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create utility functions for common style patterns

**Architecture:**
- Pure functions for common formatting patterns
- Used by style renderers to avoid duplication
- No external dependencies, only native Node.js

**Tech Stack:** TypeScript, Node.js native modules, TAP tests

**Reference Documents:**
- Design: `docs/plans/widget-display-styles-design-2026-01-08.md`
- Style Reference: `docs/plans/widget-styles-reference-2026-01-08.md`

---

## Task: Create style utility functions

**Files:**
- Create: `src/ui/utils/style-utils.ts`
- Test: `tests/unit/ui/utils/style-utils.test.ts`

### Step 1: Write the failing test

Create `tests/unit/ui/utils/style-utils.test.ts`:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert";
import {
  withLabel,
  withIndicator,
  withFancy,
  withBrackets,
  withAngleBrackets,
  formatTokens,
  progressBar,
} from "../../../src/ui/utils/style-utils.js";

describe("style-utils", () => {
  describe("withLabel", () => {
    it("should add label prefix to value", () => {
      assert.equal(withLabel("Model", "Opus 4.5"), "Model: Opus 4.5");
    });

    it("should handle empty prefix", () => {
      assert.equal(withLabel("", "Opus 4.5"), "Opus 4.5");
    });
  });

  describe("withIndicator", () => {
    it("should add indicator prefix to value", () => {
      assert.equal(withIndicator("Opus 4.5"), "● Opus 4.5");
    });
  });

  describe("withFancy", () => {
    it("should wrap value in french quotes", () => {
      assert.equal(withFancy("Opus 4.5"), "«Opus 4.5»");
    });
  });

  describe("withBrackets", () => {
    it("should wrap value in square brackets", () => {
      assert.equal(withBrackets("Opus 4.5"), "[Opus 4.5]");
    });
  });

  describe("withAngleBrackets", () => {
    it("should wrap value in angle brackets", () => {
      assert.equal(withAngleBrackets("71%"), "⟨71%⟩");
    });
  });

  describe("formatTokens", () => {
    it("should format thousands with K suffix", () => {
      assert.equal(formatTokens(142847), "142K");
      assert.equal(formatTokens(200000), "200K");
    });

    it("should format values below 1000 without suffix", () => {
      assert.equal(formatTokens(999), "999");
      assert.equal(formatTokens(0), "0");
    });

    it("should handle edge cases", () => {
      assert.equal(formatTokens(1000), "1K");
      assert.equal(formatTokens(999999), "1000K"); // No M suffix for simplicity
    });
  });

  describe("progressBar", () => {
    it("should show correct progress at 0%", () => {
      assert.equal(progressBar(0, 10), "░░░░░░░░░░");
    });

    it("should show correct progress at 50%", () => {
      assert.equal(progressBar(50, 10), "█████░░░░░");
    });

    it("should show correct progress at 100%", () => {
      assert.equal(progressBar(100, 10), "██████████");
    });

    it("should clamp percentage to 0-100 range", () => {
      assert.equal(progressBar(-10, 10), "░░░░░░░░░░");
      assert.equal(progressBar(150, 10), "██████████");
    });

    it("should support custom width", () => {
      assert.equal(progressBar(50, 5), "███░░");
      assert.equal(progressBar(100, 20), "████████████████████");
    });

    it("should use default width of 10", () => {
      assert.equal(progressBar(30), "███░░░░░░░");
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/ui/utils/style-utils.test.ts
```

Expected: FAIL with "Cannot find package '../../../src/ui/utils/style-utils.js'"

---

### Step 3: Write minimal implementation

Create `src/ui/utils/style-utils.ts`:

```typescript
/**
 * Style utility functions for common display patterns
 *
 * These functions provide reusable formatting patterns used across
 * different widget style renderers. They help avoid code duplication
 * and ensure consistent formatting.
 */

/**
 * Add a label prefix to a value
 *
 * @param prefix - The label prefix (e.g., "Model", "Cost")
 * @param value - The value to label
 * @returns Formatted string with label prefix
 *
 * @example
 * withLabel("Model", "Opus 4.5") // "Model: Opus 4.5"
 */
export function withLabel(prefix: string, value: string): string {
  if (prefix === "") return value;
  return `${prefix}: ${value}`;
}

/**
 * Add a status indicator to a value
 *
 * @param value - The value to indicate
 * @returns Formatted string with bullet indicator
 *
 * @example
 * withIndicator("Opus 4.5") // "● Opus 4.5"
 */
export function withIndicator(value: string): string {
  return `● ${value}`;
}

/**
 * Wrap a value in fancy french quotes
 *
 * @param value - The value to wrap
 * @returns Formatted string with french quotes
 *
 * @example
 * withFancy("$0.42") // "«$0.42»"
 */
export function withFancy(value: string): string {
  return `«${value}»`;
}

/**
 * Wrap a value in square brackets
 *
 * @param value - The value to wrap
 * @returns Formatted string with brackets
 *
 * @example
 * withBrackets("main") // "[main]"
 */
export function withBrackets(value: string): string {
  return `[${value}]`;
}

/**
 * Wrap a value in angle brackets
 *
 * @param value - The value to wrap
 * @returns Formatted string with angle brackets
 *
 * @example
 * withAngleBrackets("71%") // "⟨71%⟩"
 */
export function withAngleBrackets(value: string): string {
  return `⟨${value}⟩`;
}

/**
 * Format a number as token count with K suffix
 *
 * @param n - The number to format
 * @returns Formatted string with K suffix for thousands
 *
 * @example
 * formatTokens(142847) // "142K"
 * formatTokens(999) // "999"
 */
export function formatTokens(n: number): string {
  if (n < 1000) return n.toString();
  return `${Math.floor(n / 1000)}K`;
}

/**
 * Create a progress bar string
 *
 * @param percent - Percentage (0-100), will be clamped
 * @param width - Width of the bar in characters (default 10)
 * @returns Progress bar string with █ (filled) and ░ (empty)
 *
 * @example
 * progressBar(71, 10) // "███████░░░"
 * progressBar(50) // "█████░░░░░" (default width 10)
 */
export function progressBar(percent: number, width = 10): string {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
```

---

### Step 4: Run test to verify it passes

```bash
npm test -- tests/unit/ui/utils/style-utils.test.ts
```

Expected: PASS (all tests)

---

### Step 5: Format code with Biome

```bash
npx @biomejs/biome format --write ./src/ui/utils/style-utils.ts ./tests/unit/ui/utils/style-utils.test.ts
```

Expected: "Formatted 2 files in Xms"

---

### Step 6: Commit

```bash
git add src/ui/utils/style-utils.ts tests/unit/ui/utils/style-utils.test.ts
git commit -m "feat: add style utility functions for common patterns"
```

---

### Step 7: Verify no test regressions

```bash
npm test
```

Expected: All tests pass

---

## Phase 2 Completion Checklist

After completing the task:

- [ ] All new tests pass
- [ ] All existing tests still pass
- [ ] Code is formatted with Biome
- [ ] 1 atomic commit made
- [ ] Files created:
  - [ ] `src/ui/utils/style-utils.ts`
  - [ ] `tests/unit/ui/utils/style-utils.test.ts`

**Total commits for Phase 2:** 1

---

## Next Phase Preview

Phase 3 will refactor `formatCostUSD()` to always use 2 decimal places with tests.
