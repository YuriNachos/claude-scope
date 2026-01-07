# Poker Widget Improvements v2 + Git Deploy Tag Widget Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance poker widget with better spacing, throttling, and lighter label colors; create new Git Deploy Tag widget.

**Architecture:**
- Add `lightGray` color constant for labels (better contrast)
- Implement update throttling with `lastUpdateTimestamp` in PokerWidget
- Add spacing between cards for better readability
- Create new GitTagWidget to show latest git tag
- All changes follow TDD with atomic commits

**Tech Stack:**
- TypeScript
- node:test + chai for testing
- ANSI escape codes: `\x1b[37m` (light gray), `\x1b[1m` (bold)

---

## Task 1: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add current version to changelog**

Add to the current version section:
```markdown
**Current version**: v0.4.3

**Implemented features**:
- Poker widget with participation-based formatting
- Parentheses for participating cards with bold
- All cards show suit color (red for ♥♦, gray for ♠♣)
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for v0.4.3"
```

---

## Task 2: Add lightGray Color Constant

**Files:**
- Modify: `src/ui/utils/colors.ts`
- Test: `tests/unit/utils/colors.test.ts`

**Step 1: Write failing test**

```typescript
// tests/unit/utils/colors.test.ts

describe('lightGray color', () => {
  it('should export lightGray constant', () => {
    const { lightGray } = await import('../src/ui/utils/colors.js');
    assert.strictEqual(lightGray, '\x1b[37m');  // White/light gray
  });

  it('should be different from regular gray', () => {
    const { gray, lightGray } = await import('../src/ui/utils/colors.js');
    assert.notStrictEqual(gray, lightGray);
    assert.strictEqual(gray, '\x1b[90m');   // Bright black
    assert.strictEqual(lightGray, '\x1b[37m'); // Light gray/white
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/utils/colors.test.ts`
Expected: FAIL with "lightGray is not defined"

**Step 3: Add lightGray constant**

```typescript
// src/ui/utils/colors.ts

/**
 * Foreground colors (30-37, 90 for bright/bold variants)
 */
export const red = '\x1b[31m';
export const green = '\x1b[32m';
export const yellow = '\x1b[33m';
export const blue = '\x1b[34m';
export const magenta = '\x1b[35m';
export const cyan = '\x1b[36m';
export const white = '\x1b[37m';
export const gray = '\x1b[90m';
export const lightGray = '\x1b[37m';  // Light gray for labels
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/utils/colors.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ui/utils/colors.ts tests/unit/utils/colors.test.ts
git commit -m "feat: add lightGray color constant for better label contrast"
```

---

## Task 3: Update PokerWidget Label Colors to lightGray

**Files:**
- Modify: `src/widgets/poker-widget.ts`
- Test: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Update imports**

```typescript
// src/widgets/poker-widget.ts

import { bold, gray, lightGray, red, reset } from '../ui/utils/colors.js';
```

**Step 2: Change label colors**

```typescript
// src/widgets/poker-widget.ts - in renderWithData method

const handLabel = colorize('Hand:', lightGray);
const boardLabel = colorize('Board:', lightGray);
```

**Step 3: Update tests**

```typescript
// tests/unit/widgets/poker-widget.test.ts

it('should use lightGray color for Hand: and Board: labels', async () => {
  const widget = new PokerWidget();
  await widget.update(createMockStdinData({}));
  const result = await widget.render({ width: 80, timestamp: 0 });

  // Check for lightGray ANSI code (37m) instead of gray (90m)
  assert.ok(result?.includes('\x1b[37m'));
  // Also verify Hand: and Board: labels are present
  assert.ok(result?.includes('Hand:'));
  assert.ok(result?.includes('Board:'));
});
```

**Step 4: Run tests**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker-widget.ts tests/unit/widgets/poker-widget.test.ts
git commit -m "feat: use lightGray for poker widget labels

- Changes Hand:/Board: labels to lightGray (\\x1b[37m)
- Better contrast against gray card suits (\\x1b[90m)"
```

---

## Task 4: Add Card Spacing for Better Readability

**Files:**
- Modify: `src/widgets/poker-widget.ts`
- Test: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Write failing test**

```typescript
// tests/unit/widgets/poker-widget.test.ts

describe('card spacing', () => {
  it('should add space after participating cards with parentheses', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || '');

    // Cards with parentheses should have trailing space
    // Pattern: (K♠) followed by space or end
    assert.match(cleanResult, /\([A-Z0-9]+[♠♥♦♣]\) /);
  });

  it('should have consistent spacing between all cards', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Should not have cards without proper spacing
    // Check we don't have )( or card immediately followed by another card
    assert.ok(!result?.includes(')('));
    assert.ok(!result?.includes(')♠'));
    assert.ok(!result?.includes(')♥'));
    assert.ok(!result?.includes(')♦'));
    assert.ok(!result?.includes(')♣'));
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "card spacing"`
Expected: FAIL - cards are joined without spaces

**Step 3: Update formatCardByParticipation to add spacing**

```typescript
// src/widgets/poker-widget.ts

private formatCardByParticipation(
  cardData: { card: Card; formatted: string },
  isParticipating: boolean
): string {
  const color = isRedSuit(cardData.card.suit) ? red : gray;
  const cardText = formatCard(cardData.card);

  if (isParticipating) {
    // Participating: (K♠) with color + BOLD, followed by space
    return `${color}${bold}(${cardText})${reset} `;
  } else {
    // Non-participating: K♠ with color, no brackets, with trailing space
    return `${color}${cardText}${reset} `;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "card spacing"`
Expected: PASS

**Step 5: Run full widget tests**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`
Expected: All tests pass (may need to adjust existing spacing tests)

**Step 6: Commit**

```bash
git add src/widgets/poker-widget.ts tests/unit/widgets/poker-widget.test.ts
git commit -m "feat: add spacing between poker cards for better readability

- Add trailing space after all cards (participating and non-participating)
- Prevents cards from clumping together: (A♠) K♥  instead of (A♠)K♥
- Improves visual separation in the statusline"
```

---

## Task 5: Add Update Throttling to PokerWidget

**Files:**
- Modify: `src/widgets/poker-widget.ts`
- Test: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Write failing test**

```typescript
// tests/unit/widgets/poker-widget.test.ts

describe('update throttling', () => {
  it('should not update hand within 5 seconds of last update', async () => {
    const widget = new PokerWidget() as any;

    const mockData = createMockStdinData({});

    // First update
    await widget.update(mockData);
    const firstRender = await widget.render({ width: 80, timestamp: 0 });
    const firstCards = stripAnsi(firstRender || '').match(/10|[JQKA]/g) || [];

    // Second update immediately (should be throttled)
    await widget.update(mockData);
    const secondRender = await widget.render({ width: 80, timestamp: 1000 }); // 1 second later
    const secondCards = stripAnsi(secondRender || '').match(/10|[JQKA]/g) || [];

    // Cards should be the same (throttled)
    assert.deepStrictEqual(secondCards, firstCards);
  });

  it('should update hand after 5 seconds have passed', async () => {
    const widget = new PokerWidget() as any;

    const mockData = createMockStdinData({});

    // First update at timestamp 0
    await widget.update(mockData);
    const firstRender = await widget.render({ width: 80, timestamp: 0 });
    const firstCards = stripAnsi(firstRender || '');

    // Second update at 6 seconds (should generate new hand)
    await widget.update(mockData);
    const secondRender = await widget.render({ width: 80, timestamp: 6000 });
    const secondCards = stripAnsi(secondRender || '');

    // Due to randomness, cards should be different (highly likely)
    // If they're the same, that's extremely rare but possible
    const areDifferent = firstCards !== secondCards;
    assert.ok(areDifferent, 'Cards should be different after 5 seconds');
  });

  it('should track last update timestamp', async () => {
    const widget = new PokerWidget() as any;
    const mockData = createMockStdinData({});

    assert.strictEqual(widget.lastUpdateTimestamp, 0);

    await widget.update(mockData);

    assert.ok(widget.lastUpdateTimestamp > 0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "update throttling"`
Expected: FAIL with "lastUpdateTimestamp is not defined"

**Step 3: Implement throttling logic**

```typescript
// src/widgets/poker-widget.ts

export class PokerWidget extends StdinDataWidget {
  readonly id = 'poker';
  readonly metadata = createWidgetMetadata(
    'Poker',
    'Displays random Texas Hold\'em hands for entertainment',
    '1.0.0',
    'claude-scope',
    2
  );

  private holeCards: { card: Card; formatted: string }[] = [];
  private boardCards: { card: Card; formatted: string }[] = [];
  private handResult: { text: string; participatingIndices: number[] } | null = null;
  private lastUpdateTimestamp = 0;  // Track when hand was last generated
  private readonly THROTTLE_MS = 5000;  // 5 seconds minimum between updates

  constructor() {
    super();
  }

  /**
   * Generate new poker hand on each update
   * Throttled to update at most once every 5 seconds
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    const now = Date.now();

    // Check if enough time has passed since last update
    if (now - this.lastUpdateTimestamp < this.THROTTLE_MS) {
      // Skip update - keep current hand
      return;
    }

    // Generate new hand
    const deck = new Deck();
    const hole = [deck.deal(), deck.deal()];
    const board = [deck.deal(), deck.deal(), deck.deal(), deck.deal(), deck.deal()];
    const result = evaluateHand(hole, board);

    this.holeCards = hole.map(card => ({
      card,
      formatted: this.formatCardColor(card)
    }));

    this.boardCards = board.map(card => ({
      card,
      formatted: this.formatCardColor(card)
    }));

    const playerParticipates = result.participatingCards.some(idx => idx < 2);

    if (!playerParticipates) {
      this.handResult = {
        text: `Nothing 🃏`,
        participatingIndices: result.participatingCards
      };
    } else {
      this.handResult = {
        text: `${result.name}! ${result.emoji}`,
        participatingIndices: result.participatingCards
      };
    }

    this.lastUpdateTimestamp = now;
  }
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts --grep "update throttling"`
Expected: PASS

**Step 5: Run full widget tests**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`
Expected: All tests pass

**Step 6: Commit**

```bash
git add src/widgets/poker-widget.ts tests/unit/widgets/poker-widget.test.ts
git commit -m "feat: add 5-second throttling to poker widget updates

- Prevents rapid hand regeneration on frequent stdin updates
- Tracks lastUpdateTimestamp to enforce THROTTLE_MS (5000ms) minimum
- Improves UX by showing stable hand instead of flickering cards"
```

---

## Task 6: Create Git Tag Widget

**Files:**
- Create: `src/widgets/git/git-tag-widget.ts`
- Create: `tests/unit/widgets/git/git-tag-widget.test.ts`
- Modify: `src/index.ts` (register widget)

**Step 1: Write the failing test**

```typescript
// tests/unit/widgets/git/git-tag-widget.test.ts

import { assert } from 'node:test';
import { GitTagWidget } from '../../../../src/widgets/git/git-tag-widget.js';
import type { IGit } from '../../../../src/providers/git-provider.js';
import { createMockStdinData } from '../../../helpers/mock-data.js';

describe('GitTagWidget', () => {
  it('should display latest git tag', async () => {
    const mockGit: IGit = {
      checkIsRepo: async () => true,
      branch: async () => ({ current: 'main', all: ['main', 'develop'] }),
      latestTag: async () => 'v1.2.3'
    };

    const widget = new GitTagWidget(mockGit);
    await widget.initialize({ config: {} });
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    assert.ok(result);
    assert.ok(result?.includes('v1.2.3'));
  });

  it('should show "no tag" when no tags exist', async () => {
    const mockGit: IGit = {
      checkIsRepo: async () => true,
      branch: async () => ({ current: 'main', all: ['main'] }),
      latestTag: async () => null
    };

    const widget = new GitTagWidget(mockGit);
    await widget.initialize({ config: {} });
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    assert.ok(result);
    assert.ok(result?.includes('no tag'));
  });

  it('should return null when not in a git repo', async () => {
    const mockGit: IGit = {
      checkIsRepo: async () => false,
      branch: async () => ({ current: null, all: [] })
    };

    const widget = new GitTagWidget(mockGit);
    await widget.initialize({ config: {} });
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    assert.strictEqual(result, null);
  });

  it('should be enabled by default', async () => {
    const mockGit: IGit = {
      checkIsRepo: async () => true,
      branch: async () => ({ current: 'main', all: ['main'] }),
      latestTag: async () => 'v1.0.0'
    };

    const widget = new GitTagWidget(mockGit);
    await widget.initialize({ config: {} });

    assert.strictEqual(widget.isEnabled(), true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/git/git-tag-widget.test.ts`
Expected: FAIL with "Cannot find module 'git-tag-widget'"

**Step 3: Implement GitTagWidget**

```typescript
// src/widgets/git/git-tag-widget.ts

/**
 * Git Tag Widget
 *
 * Displays the latest git tag for the current repository
 * Useful for tracking deploy/release versions
 */

import { createWidgetMetadata } from '../../core/widget-types.js';
import type { IGit } from '../../providers/git-provider.js';
import { colorize } from '../../ui/utils/formatters.js';
import { green, gray, lightGray } from '../../ui/utils/colors.js';
import type { IWidget, WidgetContext, RenderContext } from '../../core/types.js';
import type { StdinData } from '../../types.js';

export class GitTagWidget implements IWidget {
  readonly id = 'git-tag';
  readonly metadata = createWidgetMetadata(
    'Git Tag',
    'Displays the latest git tag',
    '1.0.0',
    'claude-scope'
  );

  private enabled = true;
  private latestTag: string | null = null;
  private git: IGit;

  constructor(git: IGit) {
    this.git = git;
  }

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async update(data: StdinData): Promise<void> {
    const isRepo = await this.git.checkIsRepo();
    if (!isRepo) {
      this.latestTag = null;
      return;
    }

    this.latestTag = await this.git.latestTag?.() ?? null;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.latestTag) {
      return null;
    }

    const tagLabel = colorize('Tag:', lightGray);
    const tagValue = colorize(this.latestTag, green);

    return `${tagLabel} ${tagValue}`;
  }
}
```

**Step 4: Add latestTag method to git-provider if needed**

```typescript
// src/providers/git-provider.ts

export interface IGit {
  checkIsRepo(): Promise<boolean>;
  branch(): Promise<{ current: string | null; all: string[] }>;
  changes?: () => Promise<{ insertions: number; deletions: number }>;
  latestTag?(): Promise<string | null>;
}

export class GitProvider implements IGit {
  // ... existing methods ...

  async latestTag(): Promise<string | null> {
    try {
      const { stdout } = await exec('git', ['describe', '--tags', '--abbrev=0'], {
        cwd: this.cwd,
        timeout: 5000
      });
      return stdout.trim();
    } catch {
      return null;
    }
  }
}
```

**Step 5: Register widget in index.ts**

```typescript
// src/index.ts

import { GitTagWidget } from './widgets/git/git-tag-widget.js';

// In main() function, after other widgets:
await registry.register(new GitTagWidget(new GitProvider()));
```

**Step 6: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/git/git-tag-widget.test.ts`
Expected: PASS

**Step 7: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 8: Commit**

```bash
git add src/widgets/git/git-tag-widget.ts tests/unit/widgets/git/git-tag-widget.test.ts src/providers/git-provider.ts src/index.ts
git commit -m "feat: add GitTagWidget for displaying latest git tag

- Shows latest git tag with green color formatting
- Useful for tracking deploy/release versions
- Returns null when not in git repo or no tags exist
- Enabled by default"
```

---

## Task 7: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`

Expected: All tests pass (should be 290+ tests now)

**Step 2: Fix any issues**

If tests fail, fix and commit with descriptive message.

---

## Task 8: Build and Manual Verification

**Step 1: Build the project**

```bash
npm run build
```

Expected: Clean build with no errors

**Step 2: Install locally**

```bash
npm install -g .
```

**Step 3: Test poker widget spacing**

Run multiple times to see:
- Light gray labels: `Tag:` should be lighter than card colors
- Spacing: Cards should have spaces between them: `(A♠) K♥  (2♦)`
- Throttling: Cards should stay same for 5 seconds

**Step 4: Test git tag widget**

```bash
cd /path/to/git/repo
claude-scope
```

Expected: Should see `Tag: v1.2.3` (or latest tag)

**Step 5: Commit any fixes**

If manual testing reveals issues, fix and commit.

---

## Task 9: Create Release v0.5.0

**Step 1: Bump minor version**

Run: `npm version minor`

Expected: Version bumps from 0.4.3 to 0.5.0 (minor for new widget)

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

This implementation includes:

1. **CLAUDE.md update** - Documents current v0.4.3 state
2. **lightGray color** - New constant `\x1b[37m` for better label contrast
3. **Label color update** - Hand:/Board: now use lightGray instead of gray
4. **Card spacing** - All cards have trailing space for readability
5. **Update throttling** - Poker widget updates max once per 5 seconds
6. **GitTagWidget** - New widget showing latest git tag in green
7. **Release v0.5.0** - All features bundled and deployed

**Example outputs:**

```
Poker widget with improvements:
Tag: v1.2.3 │ glm-4.7 │ [██████░░░░░░░░░░░░░░] 31% │ $22.71 │ +4603/-112 │ 4h 12m 7s │ main
Hand: (A♠) K♥  │ Board: (2♦)(7♣) 10♠ (3♥)6♥  → Two Pair! ✌️
```

**Spacing details:**
- Participating cards: `(K♠) ` - parentheses, bold, color, trailing space
- Non-participating cards: `K♥ ` - color, trailing space
- Labels: `Tag:`, `Hand:`, `Board:` in light gray for contrast
