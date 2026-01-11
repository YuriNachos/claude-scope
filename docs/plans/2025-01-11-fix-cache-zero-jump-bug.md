# Fix Cache Zero-Jump Bug Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Fix the bug where zero values overwrite the cache, causing widgets to show zeros when current_usage is null during tool execution.

**Architecture:** Modify cache update logic in both CacheMetricsWidget and ContextWidget to only cache when there are meaningful (non-zero) token values. This prevents legitimate cache data from being overwritten by zero-value state, which then gets displayed as zeros during fallback.

**Tech Stack:** TypeScript, Node.js, existing CacheManager, Node.js test runner

---

## Task 1: Add Failing Test for CacheMetricsWidget Zero-Jump Bug

**Files:**
- Modify: `tests/unit/widgets/cache-metrics-widget.test.ts`

**Step 1: Write the failing test**

Add this test to the `describe("cache persistence")` section (after line 520):

```typescript
it("should not overwrite cache with zero values", async () => {
  const widget = new CacheMetricsWidget();

  // First update with valid data - this should be cached
  await widget.update(
    createMockStdinData({
      session_id: "test-zero-jump",
      context_window: {
        total_input_tokens: 100000,
        total_output_tokens: 50000,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 50000,
          output_tokens: 30000,
          cache_read_input_tokens: 35000,
          cache_creation_input_tokens: 5000,
        },
      },
    })
  );

  const result1 = await widget.render({ width: 80, timestamp: 0 });
  expect(result1).to.not.be.null;
  expect(result1).to.include("35k"); // formatK(35000)

  // Second update with zero values - should NOT overwrite cache
  await widget.update(
    createMockStdinData({
      session_id: "test-zero-jump",
      context_window: {
        total_input_tokens: 100000,
        total_output_tokens: 50000,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 0,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    })
  );

  // Third update with null current_usage (tool execution scenario)
  await widget.update(
    createMockStdinData({
      session_id: "test-zero-jump",
      context_window: {
        total_input_tokens: 100000,
        total_output_tokens: 50000,
        context_window_size: 200000,
        current_usage: null,
      },
    })
  );

  const result3 = await widget.render({ width: 80, timestamp: 0 });
  // Should still show 35k from the first update, NOT 0
  expect(result3).to.not.be.null;
  expect(result3).to.include("35k");
  expect(result3).to.not.include("0 cache");
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/widgets/cache-metrics-widget.test.ts`

Expected: FAIL - test shows "0 cache" instead of "35k" because zero values overwrote the cache

**Step 3: No implementation yet**

This is the failing test step - we're establishing the bug exists.

**Step 4: No test run yet**

Failing test confirms the bug.

**Step 5: Commit the failing test**

```bash
git add tests/unit/widgets/cache-metrics-widget.test.ts
git commit -m "test(cache-metrics): add failing test for zero-jump bug"
```

---

## Task 2: Add Failing Test for ContextWidget Zero-Jump Bug

**Files:**
- Modify: `tests/unit/widgets/context-widget.test.ts`

**Step 1: Write the failing test**

Add this test to the `describe("cache persistence")` section (after line 559):

```typescript
it("should not overwrite cache with zero values", async () => {
  const widget = new ContextWidget();

  // First update with valid data - this should be cached
  await widget.update(
    createMockStdinData({
      session_id: "test-context-zero-jump",
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 75000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 0,
        },
      },
    })
  );

  const result1 = await widget.render({ width: 80, timestamp: 0 });
  assert.ok(result1);
  const clean1 = stripAnsi(result1 || "");
  expect(clean1).to.include("45%"); // (75000 + 10000 + 5000) / 200000 = 45%

  // Second update with zero values - should NOT overwrite cache
  await widget.update(
    createMockStdinData({
      session_id: "test-context-zero-jump",
      context_window: {
        total_input_tokens: 0,
        total_output_tokens: 0,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 0,
          output_tokens: 0,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        },
      },
    })
  );

  // Third update with null current_usage (tool execution scenario)
  await widget.update(
    createMockStdinData({
      session_id: "test-context-zero-jump",
      context_window: {
        total_input_tokens: 0,
        total_output_tokens: 0,
        context_window_size: 200000,
        current_usage: null,
      },
    })
  );

  const result3 = await widget.render({ width: 80, timestamp: 0 });
  // Should still show 45% from the first update, NOT 0%
  assert.ok(result3);
  const clean3 = stripAnsi(result3 || "");
  expect(clean3).to.include("45%");
  expect(clean3).to.not.include("0%");
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/widgets/context-widget.test.ts`

Expected: FAIL - test shows "0%" instead of "45%" because zero values overwrote the cache

**Step 3: No implementation yet**

This is the failing test step - we're establishing the bug exists.

**Step 4: No test run yet**

Failing test confirms the bug.

**Step 5: Commit the failing test**

```bash
git add tests/unit/widgets/context-widget.test.ts
git commit -m "test(context): add failing test for zero-jump bug"
```

---

## Task 3: Fix CacheMetricsWidget Cache Update Logic

**Files:**
- Modify: `src/widgets/cache-metrics/cache-metrics-widget.ts:97-113`

**Step 1: Read current implementation**

The current `update()` method (lines 97-113):

```typescript
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
```

**Step 2: Modify to only cache when input_tokens > 0**

Replace lines 100-109 with:

```typescript
// Store valid current_usage in cache
// Only cache if there are meaningful values (input_tokens > 0)
// This prevents zero values from overwriting valid cache data
const usage = data.context_window?.current_usage;
if (usage && usage.input_tokens > 0) {
  this.cacheManager.setCachedUsage(data.session_id, {
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    cache_creation_input_tokens: usage.cache_creation_input_tokens,
    cache_read_input_tokens: usage.cache_read_input_tokens,
  });
}
```

**Step 3: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/widgets/cache-metrics-widget.test.ts`

Expected: PASS - the zero-jump test now passes

**Step 4: Run all cache-metrics tests**

Run: `npm run test:unit -- tests/unit/widgets/cache-metrics-widget.test.ts`

Expected: All tests pass (including the new zero-jump test)

**Step 5: Commit the fix**

```bash
git add src/widgets/cache-metrics/cache-metrics-widget.ts
git commit -m "fix(cache-metrics): prevent zero values from overwriting cache

Only cache usage data when input_tokens > 0. This prevents the cache
from being overwritten with zero values, which would then be displayed
when current_usage is null during tool execution."
```

---

## Task 4: Fix ContextWidget Cache Update Logic

**Files:**
- Modify: `src/widgets/context-widget.ts:48-62`

**Step 1: Read current implementation**

The current `update()` method (lines 48-62):

```typescript
async update(data: StdinData): Promise<void> {
  await super.update(data);

  const { current_usage } = data.context_window;

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
```

**Step 2: Modify to only cache when any token value > 0**

Replace lines 51-61 with:

```typescript
// If we have valid current_usage, cache it
// Only cache if there are meaningful values (any tokens > 0)
// This prevents zero values from overwriting valid cache data
const { current_usage } = data.context_window;
if (current_usage) {
  const hasAnyTokens =
    current_usage.input_tokens > 0 ||
    current_usage.output_tokens > 0 ||
    current_usage.cache_creation_input_tokens > 0 ||
    current_usage.cache_read_input_tokens > 0;

  if (hasAnyTokens) {
    this.cacheManager.setCachedUsage(data.session_id, {
      input_tokens: current_usage.input_tokens,
      output_tokens: current_usage.output_tokens,
      cache_creation_input_tokens: current_usage.cache_creation_input_tokens,
      cache_read_input_tokens: current_usage.cache_read_input_tokens,
    });
  }
}
```

**Step 3: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/widgets/context-widget.test.ts`

Expected: PASS - the zero-jump test now passes

**Step 4: Run all context tests**

Run: `npm run test:unit -- tests/unit/widgets/context-widget.test.ts`

Expected: All tests pass (including the new zero-jump test)

**Step 5: Commit the fix**

```bash
git add src/widgets/context-widget.ts
git commit -m "fix(context): prevent zero values from overwriting cache

Only cache usage data when any token value > 0. This prevents the cache
from being overwritten with zero values, which would then be displayed
when current_usage is null during tool execution."
```

---

## Task 5: Verify Full Test Suite Passes

**Files:**
- None (verification step)

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 2: Run all unit tests**

Run: `npm run test:unit`

Expected: All tests pass (509+ tests)

**Step 3: Run cache manager tests specifically**

Run: `npm run test:unit -- tests/unit/storage/cache-manager.test.ts`

Expected: All cache manager tests pass

**Step 4: Clean up test cache file**

The test cache file at `~/.config/claude-scope/cache.json` may have test data. Clean it:

Run: `node -e "const { CacheManager } = require('./dist/storage/cache-manager.js'); new CacheManager().clearCache();"`

Or manually: `rm ~/.config/claude-scope/cache.json`

**Step 5: No commit needed**

This is verification only - no code changes.

---

## Task 6: Add Comment Documentation to CacheManager

**Files:**
- Modify: `src/storage/cache-manager.ts:1-11`

**Step 1: Update file header documentation**

Replace lines 1-6 with:

```typescript
/**
 * Cache Manager for persisting widget state
 *
 * Stores last valid context_usage values to prevent flickering
 * when Claude Code sends null current_usage during tool execution.
 *
 * IMPORTANT: Widgets should only cache data when there are meaningful
 * (non-zero) token values. This prevents zero-value state from overwriting
 * valid cache data, which would cause widgets to incorrectly display zeros
 * when falling back to cache during tool execution.
 *
 * Cache entries are session-specific and expire after 5 minutes by default.
 */
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Run tests**

Run: `npm run test:unit -- tests/unit/storage/cache-manager.test.ts`

Expected: All tests pass

**Step 4: Commit documentation update**

```bash
git add src/storage/cache-manager.ts
git commit -m "docs(cache-manager): document cache usage best practices

Add documentation explaining that widgets should only cache meaningful
(non-zero) values to prevent zero-jump bug during tool execution."
```

---

## Summary

This plan fixes the cache zero-jump bug by:

1. **Reproducing the bug** - Tests that show zero values overwriting cache
2. **Fixing CacheMetricsWidget** - Only cache when input_tokens > 0
3. **Fixing ContextWidget** - Only cache when any token value > 0
4. **Documenting the fix** - Add usage guidelines to CacheManager

**Root cause:** The `if (usage)` check only verified the object exists, not that it contained meaningful data. Zero-value current_usage was overwriting valid cache.

**Fix:** Only cache when there are non-zero token values. This preserves the last meaningful state for fallback during null current_usage scenarios.

**Total commits:** 5 atomic commits
- 2 test commits (failing tests for each widget)
- 2 fix commits (one per widget)
- 1 documentation commit

**No structural changes** - All fixes are localized to cache update logic.
