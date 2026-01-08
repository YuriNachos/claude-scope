# Widget Display Styles System — Phase 3: Refactor formatCostUSD (Detailed)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `formatCostUSD()` to always use 2 decimal places

**Architecture:**
- Change from variable decimal places (2-4) to fixed 2 decimal places
- Simplify logic by removing thresholds
- Maintain backward compatibility with existing tests

**Tech Stack:** TypeScript, Node.js, TAP tests

**Current Implementation:**
```typescript
export function formatCostUSD(usd: number): string {
  const absUsd = Math.abs(usd);
  if (usd < 0) return `$${usd.toFixed(2)}`;
  else if (absUsd < 0.01) return `$${usd.toFixed(4)}`;
  else return `$${usd.toFixed(2)}`;
}
```

**New Implementation:**
```typescript
export function formatCostUSD(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
```

---

## Task: Refactor formatCostUSD to always use 2 decimal places

**Files:**
- Modify: `src/ui/utils/formatters.ts`
- Modify: `tests/unit/ui/utils/formatters.test.ts`

### Step 1: Update existing tests

Read `tests/unit/ui/utils/formatters.test.ts` and update tests to expect 2 decimal places:

**Find the formatCostUSD test suite and update expectations:**

```typescript
describe("formatCostUSD", () => {
  it("should format small values with 2 decimal places", () => {
    assert.equal(formatCostUSD(0), "$0.00");
    assert.equal(formatCostUSD(0.0042), "$0.00"); // Was "$0.0042"
    assert.equal(formatCostUSD(0.42), "$0.42");
  });

  it("should format normal values with 2 decimal places", () => {
    assert.equal(formatCostUSD(1.23), "$1.23");
    assert.equal(formatCostUSD(42), "$42.00");
  });

  it("should format large values with 2 decimal places", () => {
    assert.equal(formatCostUSD(100), "$100.00");
    assert.equal(formatCostUSD(1234.56), "$1234.56");
  });

  it("should handle negative values with 2 decimal places", () => {
    assert.equal(formatCostUSD(-0.42), "$-0.42");
    assert.equal(formatCostUSD(-1.23), "$-1.23");
  });
});
```

### Step 2: Run tests to verify current behavior

```bash
npm test -- tests/unit/ui/utils/formatters.test.ts
```

Expected: Some tests will fail (ones expecting 4 decimal places for very small values)

### Step 3: Simplify the implementation

In `src/ui/utils/formatters.ts`, replace the entire `formatCostUSD` function with:

```typescript
export function formatCostUSD(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
```

**Remove** these imports/constants if they were only used by formatCostUSD:
- `COST_THRESHOLDS` constant (if exists and unused elsewhere)
- Any related threshold logic

### Step 4: Run tests to verify they pass

```bash
npm test -- tests/unit/ui/utils/formatters.test.ts
```

Expected: All tests pass with new 2-decimal behavior

### Step 5: Run all tests to ensure no regressions

```bash
npm test
```

Expected: All tests pass (check if CostWidget tests need updating)

### Step 6: Format with Biome

```bash
npx @biomejs/biome format --write ./src/ui/utils/formatters.ts ./tests/unit/ui/utils/formatters.test.ts
```

### Step 7: Commit

```bash
git add src/ui/utils/formatters.ts tests/unit/ui/utils/formatters.test.ts
git commit -m "refactor: formatCostUSD always use 2 decimal places"
```

---

## Phase 3 Completion Checklist

- [ ] All tests pass with new behavior
- [ ] formatCostUSD simplified to one line
- [ ] COST_THRESHOLDS removed if unused
- [ ] All existing tests updated
- [ ] Code formatted with Biome
- [ ] 1 atomic commit made

**Total commits for Phase 3:** 1

---

## Implementation Notes

**Breaking Changes:** None - the function signature remains the same, only output format changes for very small values (e.g., $0.0042 → $0.00)

**Test Updates Needed:** Check if `CostWidget` or other tests depend on the old 4-decimal behavior and update accordingly.
