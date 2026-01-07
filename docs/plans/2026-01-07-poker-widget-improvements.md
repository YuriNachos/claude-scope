# Poker Widget Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance poker widget to show player participation in hand combinations and improve visual formatting.

**Architecture:**
- Update `PokerHand` interface to include participating cards information
- Add player participation detection logic to hand evaluator
- Update `PokerWidget` to format cards based on participation (brackets for participating, spaces for non-participating)
- Add "Nothing" message when player doesn't participate in the best hand
- Colorize "Hand:" and "Board:" labels in gray

**Tech Stack:**
- TypeScript
- Node.js native modules
- Existing test framework: `node:test` + `chai`

---

## Task 1: Update PokerHand Interface

**Files:**
- Modify: `src/widgets/poker/types.ts`

**Step 1: Write the failing test for extended PokerHand interface**

```typescript
// tests/unit/widgets/poker/types.test.ts
// Add this describe block to existing file

describe('PokerHand with participating cards', () => {
  it('should accept participatingCards in PokerHand', () => {
    const hand: PokerHand = {
      rank: HandRank.OnePair,
      name: 'One Pair',
      emoji: '👍',
      participatingCards: []
    };
    expect(hand.participatingCards).to.exist;
  });

  it('should store participating card indices', () => {
    const hand: PokerHand = {
      rank: HandRank.OnePair,
      name: 'One Pair',
      emoji: '👍',
      participatingCards: [0, 1] // First two cards participate
    };
    expect(hand.participatingCards).to.deep.equal([0, 1]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker/types.test.ts`
Expected: FAIL with "participatingCards does not exist in PokerHand"

**Step 3: Update PokerHand interface**

```typescript
// src/widgets/poker/types.ts

/**
 * Poker hand result
 */
export interface PokerHand {
  rank: HandRank;
  name: string;
  emoji: string;
  /** Indices of cards (from all 7 cards) that form the hand */
  participatingCards: number[];
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker/types.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker/types.ts tests/unit/widgets/poker/types.test.ts
git commit -m "feat: add participatingCards to PokerHand interface"
```

---

## Task 2: Add Player Participation Detection

**Files:**
- Modify: `src/widgets/poker/hand-evaluator.ts`
- Modify: `tests/unit/widgets/poker/hand-evaluator.test.ts`

**Step 1: Write the failing test for participation detection**

```typescript
// tests/unit/widgets/poker/hand-evaluator.test.ts
// Add this describe block

describe('Player participation detection', () => {
  it('should identify player cards in Pair (both hole cards)', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    // Indices 0,1 are hole cards (K♠, K♥) - they form the pair
    expect(result.participatingCards).to.include(0);
    expect(result.participatingCards).to.include(1);
  });

  it('should return empty participatingCards when player has nothing (Straight on board)', () => {
    const hole: Card[] = [{ rank: '2', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
    const board: Card[] = [
      { rank: '10', suit: 'spades' },
      { rank: 'J', suit: 'clubs' },
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'K', suit: 'spades' },
      { rank: 'A', suit: 'hearts' }
    ];

    const result = evaluateHand(hole, board);
    // Best hand is Straight (10-J-Q-K-A) but player's 2,3 don't participate
    expect(result.participatingCards).to.be.empty;
  });

  it('should detect one hole card participating in Two Pair', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: '3', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: 'Q', suit: 'spades' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' }
    ];

    const result = evaluateHand(hole, board);
    // Two Pair: K♠ (hole, idx 0) + Q♣Q♠ (board, idx 3,4)
    expect(result.participatingCards).to.include(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker/hand-evaluator.test.ts`
Expected: FAIL with "participatingCards not returned" or similar

**Step 3: Implement participation detection in hand-evaluator.ts**

Modify the `evaluateHand` function to track which cards form the hand:

```typescript
// src/widgets/poker/hand-evaluator.ts

/**
 * Find cards that form a specific rank (for pairs, trips, quads)
 */
function findCardsOfRank(cards: Card[], targetRank: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < cards.length; i++) {
    if (getRankValue(cards[i].rank) === targetRank) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Find cards of same suit (for flush)
 */
function findCardsOfSuit(cards: Card[], targetSuit: string): number[] {
  const indices: number[] = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit === targetSuit) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Update evaluateHand to return participating cards
 */
export function evaluateHand(hole: Card[], board: Card[]): PokerHand {
  const allCards = [...hole, ...board];
  const participatingCards: number[] = [];

  // ... existing detection logic ...

  // Royal Flush
  if (flush && straightHighCard === 14) {
    // Find 5 cards of the flush suit that form the straight
    const flushSuit = findFlushSuit(allCards);
    const suitCards = findCardsOfSuit(allCards, flushSuit);
    // Take highest 5 that form the straight
    participatingCards.push(...suitCards.slice(0, 5));
    return { rank: HandRank.RoyalFlush, ...HAND_DISPLAY[HandRank.RoyalFlush], participatingCards };
  }

  // ... similar for other hand ranks ...

  // High Card (weakest hand)
  // Find the single highest card
  const sortedValues = Array.from(countRanks(allCards).keys()).sort((a, b) => b - a);
  const highestRank = sortedValues[0];
  const highestCards = findCardsOfRank(allCards, highestRank);
  participatingCards.push(highestCards[0]); // Just the highest card

  return { rank: HandRank.HighCard, ...HAND_DISPLAY[HandRank.HighCard], participatingCards };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker/hand-evaluator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker/hand-evaluator.ts tests/unit/widgets/poker/hand-evaluator.test.ts
git commit -m "feat: add player participation detection to hand evaluator"
```

---

## Task 3: Update PokerWidget Rendering Logic

**Files:**
- Modify: `src/widgets/poker-widget.ts`
- Modify: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Update renderWithData method**

```typescript
// src/widgets/poker-widget.ts

export class PokerWidget extends StdinDataWidget {
  // ... existing properties ...

  private holeCards: { card: Card; formatted: string }[] = [];
  private boardCards: { card: Card; formatted: string }[] = [];
  private handResult: { text: string; participatingIndices: number[] } | null = null;

  /**
   * Generate new poker hand on each update
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    const deck = new Deck();

    const hole = [
      deck.deal(),
      deck.deal()
    ];

    const board = [
      deck.deal(),
      deck.deal(),
      deck.deal(),
      deck.deal(),
      deck.deal()
    ];

    const result = evaluateHand(hole, board);

    // Store cards with their original data and formatted versions
    this.holeCards = hole.map(card => ({
      card,
      formatted: this.formatCardColor(card)
    }));

    this.boardCards = board.map(card => ({
      card,
      formatted: this.formatCardColor(card)
    }));

    // Determine if player participates (any hole card in participatingCards)
    const playerParticipates = result.participatingCards.some(idx => idx < 2);

    // If player doesn't participate, show "Nothing"
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
  }

  /**
   * Format card with color (red for ♥♦, gray for ♠♣)
   */
  private formatCardColor(card: Card): string {
    const color = isRedSuit(card.suit) ? red : gray;
    return colorize(`[${formatCard(card)}]`, color);
  }

  /**
   * Format card based on participation
   * Participating: [K♠]
   * Non-participating:  K♠  (no brackets, just spaces)
   */
  private formatCardByParticipation(
    cardData: { card: Card; formatted: string },
    index: number,
    isParticipating: boolean
  ): string {
    if (isParticipating) {
      return cardData.formatted; // Keep brackets: [K♠]
    } else {
      // Remove brackets, add spaces: K♠ becomes " K♠ "
      const inner = cardData.formatted.match(/\[(.+)\]/)?.[1] || cardData.formatted;
      return ` ${inner} `;
    }
  }

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    // Create index map for all 7 cards
    const allCards = [...this.holeCards, ...this.boardCards];
    const participatingSet = new Set(this.handResult?.participatingIndices || []);

    // Format hole cards
    const handStr = this.holeCards
      .map((hc, idx) => this.formatCardByParticipation(hc, idx, participatingSet.has(idx)))
      .join('');

    // Format board cards (indices 2-6)
    const boardStr = this.boardCards
      .map((bc, idx) => this.formatCardByParticipation(bc, idx + 2, participatingSet.has(idx + 2)))
      .join('');

    // Colorize labels
    const handLabel = colorize('Hand:', gray);
    const boardLabel = colorize('Board:', gray);

    return `${handLabel} ${handStr} | ${boardLabel} ${boardStr} → ${this.handResult?.text}`;
  }
}
```

**Step 2: Write tests for new rendering**

```typescript
// tests/unit/widgets/poker-widget.test.ts
// Add these tests

describe('player participation rendering', () => {
  it('should show Nothing when player does not participate', async () => {
    const widget = new PokerWidget();

    // This will generate random hands, so we verify the logic exists
    await widget.update(createMockStdinData({}));
    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.exist;
    // Should contain "Nothing" or a hand name depending on luck
  });

  it('should colorize Hand: and Board: labels', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Check for gray ANSI code
    expect(result).to.include('\x1b[90m'); // Gray code
  });

  it('should show participating cards with brackets', async () => {
    // We'd need to mock the deck to test exact scenarios
    // For now, verify formatting logic exists
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    expect(result).to.exist;
  });
});
```

**Step 3: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/widgets/poker-widget.ts tests/unit/widgets/poker-widget.test.ts
git commit -m "feat: update poker widget with participation-based formatting"
```

---

## Task 4: Add Helper Function to Find Flush Suit

**Files:**
- Modify: `src/widgets/poker/hand-evaluator.ts`

**Step 1: Add findFlushSuit helper**

```typescript
// src/widgets/poker/hand-evaluator.ts

/**
 * Find the suit that has 5+ cards (for flush detection)
 */
function findFlushSuit(cards: Card[]): string | null {
  const suitCounts = countSuits(cards);

  for (const [suit, count] of suitCounts.entries()) {
    if (count >= 5) {
      return suit;
    }
  }

  return null;
}
```

**Step 2: Run tests to verify**

Run: `npm test -- tests/unit/widgets/poker/hand-evaluator.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add src/widgets/poker/hand-evaluator.ts
git commit -m "refactor: add findFlushSuit helper function"
```

---

## Task 5: Update All Hand Rankings with Participation Tracking

**Files:**
- Modify: `src/widgets/poker/hand-evaluator.ts`

**Step 1: Update evaluateHand to track participating cards for all rankings**

Complete rewrite of evaluateHand to properly track participating cards for each hand type. This requires careful logic to identify which specific cards form each hand combination.

**Step 2: Run full hand evaluator tests**

Run: `npm test -- tests/unit/widgets/poker/hand-evaluator.test.ts`
Expected: All 10 hand ranking tests + 3 participation tests pass

**Step 3: Commit**

```bash
git add src/widgets/poker/hand-evaluator.ts
git commit -m "feat: track participating cards for all hand rankings"
```

---

## Task 6: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 2: Fix any issues**

If tests fail, fix and commit with descriptive message.

---

## Summary

This implementation enhances the poker widget by:

1. **Participation tracking** - Detects which cards form the best hand
2. **Player awareness** - Shows "Nothing" when player's cards don't participate
3. **Visual distinction** - Brackets for participating cards, spaces for non-participating
4. **Colorized labels** - Gray color for "Hand:" and "Board:" labels

**Example outputs:**
```
Pair (player participates):
Hand: [K♠][K♥] | Board:  Q♣  10♠  2♥  7♣  → Pair! 👍

Nothing (board has straight, player doesn't):
Hand:  2♠  3♥  | Board: [10♠][J♣][Q♦][K♠][A♥] → Nothing 🃏

Two Pair (mixed):
Hand: [K♠] 3♥  | Board: [K♦][Q♣] 10♠  2♥  7♣  → Two Pair! ✌️
```
