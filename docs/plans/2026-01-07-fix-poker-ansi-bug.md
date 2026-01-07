# Fix Poker Widget ANSI Code Bug Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix bug where ANSI color codes appear as literal text in poker widget output instead of being interpreted as terminal colors.

**Architecture:**
- The bug occurs in `formatCardByParticipation` when extracting card text from colorized strings
- ANSI codes like `\x1b[90m` contain square brackets `[90m]` which break the regex `/\[(.+)\]/`
- Solution: extract card text before adding colors, not after

**Tech Stack:**
- TypeScript
- node:test + chai for testing
- ANSI escape sequences: `\x1b[90m` (gray), `\x1b[31m` (red), `\x1b[0m` (reset)

---

## Task 1: Write Failing Test for Non-Participating Card Format

**Files:**
- Modify: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/unit/widgets/poker-widget.test.ts
// Add to existing describe block

describe('formatCardByParticipation with ANSI codes', () => {
  it('should extract card text correctly from colorized string (non-participating)', () => {
    const widget = new PokerWidget();

    // Create a mock card data with colorized formatting
    const cardData = {
      card: { rank: '6', suit: 'clubs' },
      formatted: '\x1b[90m[6♣]\x1b[0m'  // Gray colorized
    };

    // Access private method via cast
    const result = (widget as any).formatCardByParticipation(cardData, false);

    // Should be " 6♣ " with spaces, NOT " 90m[6♣ " or similar
    expect(result).to.equal(' 6♣ ');
  });

  it('should preserve brackets for participating cards', () => {
    const widget = new PokerWidget();

    const cardData = {
      card: { rank: 'A', suit: 'hearts' },
      formatted: '\x1b[31m[A♥]\x1b[0m'  // Red colorized
    };

    const result = (widget as any).formatCardByParticipation(cardData, true);

    // Should preserve the full colorized format
    expect(result).to.equal('\x1b[31m[A♥]\x1b[0m');
  });

  it('should handle red suit cards (non-participating)', () => {
    const widget = new PokerWidget();

    const cardData = {
      card: { rank: 'K', suit: 'diamonds' },
      formatted: '\x1b[31m[K♦]\x1b[0m'  // Red colorized
    };

    const result = (widget as any).formatCardByParticipation(cardData, false);

    // Should extract just the card with spaces
    expect(result).to.equal(' K♦ ');
  });

  it('should produce clean output without ANSI escape sequences visible', () => {
    const widget = new PokerWidget();

    const cardData = {
      card: { rank: '10', suit: 'spades' },
      formatted: '\x1b[90m[10♠]\x1b[0m'  // Gray colorized
    };

    const result = (widget as any).formatCardByParticipation(cardData, false);

    // Result should NOT contain literal ANSI codes
    expect(result).to.not.include('\x1b');
    expect(result).to.not.include('[90');
    expect(result).to.not.include('[0m');
    expect(result).to.equal(' 10♠ ');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "formatCardByParticipation with ANSI codes"`

Expected: FAIL with assertion errors like "expected ' 90m[6♣ ' to equal ' 6♣ '"

**Step 3: Note the failure** (no code change yet)

Just confirm the test fails as expected. This proves the bug exists.

---

## Task 2: Fix formatCardByParticipation Method

**Files:**
- Modify: `src/widgets/poker-widget.ts`

**Step 1: Fix the extraction logic**

```typescript
// src/widgets/poker-widget.ts

/**
 * Format card based on participation in best hand
 * Participating cards: [K♠] (with brackets and colors)
 * Non-participating cards:  K♠  (spaces instead of brackets, no colors)
 */
private formatCardByParticipation(
  cardData: { card: Card; formatted: string },
  isParticipating: boolean
): string {
  if (isParticipating) {
    return cardData.formatted; // [K♠] with colors
  } else {
    // Extract card text from formatCard result before colorization
    // The formatCard function returns "[6♣]" format
    // We need to extract "6♣" from it

    // First, get the plain card text without ANSI codes
    // Use formatCard directly to get plain text
    const plainText = formatCard(cardData.card); // Returns "6♣"

    // Return with spaces, no color
    return ` ${plainText} `;
  }
}
```

**Step 2: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "formatCardByParticipation with ANSI codes"`

Expected: PASS (all 4 new tests pass)

**Step 3: Run full widget tests**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`

Expected: All existing tests still pass

**Step 4: Commit**

```bash
git add src/widgets/poker-widget.ts tests/unit/widgets/poker-widget.test.ts
git commit -m "fix: correct card extraction in formatCardByParticipation

- Use formatCard() directly to get plain text without ANSI codes
- Prevents ANSI escape sequences from appearing as literal text
- Fixes bug where '[90m' appeared in output instead of proper formatting
"
```

---

## Task 3: Add Integration Test for Complete Widget Output

**Files:**
- Modify: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Add integration test for final output**

```typescript
// tests/unit/widgets/poker-widget.test.ts

describe('complete widget output with participation', () => {
  it('should render without visible ANSI codes in final output', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.exist;
    expect(result).to.be.a('string');

    // Should not have visible ANSI codes (like '90m', '31m', '0m' as text)
    // Actual ANSI codes start with ESC char (\x1b), not literal '[90m'
    expect(result).to.not.include('90m');
    expect(result).to.not.include('31m');
    expect(result).to.not.include('[0m');

    // Should have proper card symbols
    expect(result).to.match(/[♠♥♦♣]/);
  });

  it('should have proper spacing for non-participating cards', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.exist;

    // Check that we have proper format: "Hand: ... | Board: ... → ..."
    expect(result).to.include('Hand:');
    expect(result).to.include('Board:');
    expect(result).to.include('→');

    // Should not have malformed brackets like "[90m" or similar
    expect(result).to.not.match(/\[\d+m/);
  });
});
```

**Step 2: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "complete widget output"`

Expected: PASS

**Step 3: Commit**

```bash
git add tests/unit/widgets/poker-widget.test.ts
git commit -m "test: add integration tests for ANSI code visibility"
```

---

## Task 4: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`

Expected: All tests pass (should be 283+ tests now)

**Step 2: Fix any issues**

If tests fail, fix and commit with descriptive message.

---

## Task 5: Manual Verification Test

**Step 1: Build and test locally**

```bash
# Build the project
npm run build

# Install locally
npm install -g .

# Test with a simple stdin input
echo '{"session_id":"test","cwd":"/tmp","model":{"id":"test","display_name":"Test"}}' | claude-scope
```

Expected: Output should show properly formatted cards without visible ANSI codes like `[90m`, `[31m`, etc.

**Example correct output:**
```
Hand: [K♠] 3♥  | Board: [K♦][Q♣] 10♠  2♥  7♣  → Two Pair! ✌️
```

**Example BAD output (should NOT appear):**
```
Hand: 90m[K♠ 31m[3♥  | Board: ...  ← WRONG!
```

**Step 2: Commit if any adjustments needed**

If manual testing reveals issues, fix and commit.

---

## Task 6: Create Release

**Step 1: Bump patch version**

Run: `npm version patch`

Expected: Version bumps from 0.4.1 to 0.4.2

**Step 2: Push to GitHub**

```bash
git push
git push --tags
```

**Step 3: Monitor CI/CD**

Run: `gh run watch`

Expected: Workflow completes successfully

**Step 4: Verify release**

```bash
gh release view
npm view claude-scope version
npm install -g claude-scope@latest
```

---

## Summary

This fix resolves the ANSI code bug by:

1. **Root cause**: `formatCardByParticipation` was extracting card text from already-colorized strings using regex `/\[(.+)\]/`, which incorrectly matched ANSI codes like `[90m`

2. **Solution**: Use `formatCard()` directly on the card object to get plain text, then wrap with spaces for non-participating cards

3. **Test coverage**: Added 6 new tests to prevent regression:
   - 4 unit tests for `formatCardByParticipation` with ANSI codes
   - 2 integration tests for complete widget output

**Before fix:**
```
Hand:  90m[6♣  31m[5♦  | Board:  90m[3♣ ...  ← ANSI codes visible!
```

**After fix:**
```
Hand:  6♣  5♥  | Board:  3♣  10♣  J♠  8♦ [A♥] → Nothing 🃏  ← Clean!
```
