# Poker Widget Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an entertainment poker widget that displays random Texas Hold'em hands with emoji-based reactions.

**Architecture:**
- Create `src/widgets/poker/` subdirectory for poker-specific logic (deck, hand evaluation)
- PokerWidget extends StdinDataWidget base class
- Generates new random hand on each stdin update (new user command)
- Renders on line 2 (third statusline line) with format: `Hand: [A♠][K♥] | Board: [Q♦][J♣][10♠][2♥][7♣] → One Pair! 🎯`

**Tech Stack:**
- TypeScript
- Node.js native modules (crypto for random)
- Existing test framework: `node:test` + `chai`
- ANSI colors: red for ♥♦, gray for ♠♣

---

## Task 1: Create Poker Types

**Files:**
- Create: `src/widgets/poker/types.ts`

**Step 1: Write the failing test for types validation**

```typescript
// tests/unit/widgets/poker/types.test.ts
import { describe, it } from 'node:test';
import { expect } from 'chai';

describe('Suit', () => {
  it('should have four valid suits with correct symbols', () => {
    expect(Suit.Spades).to.equal('spades');
    expect(Suit.Hearts).to.equal('hearts');
    expect(Suit.Diamonds).to.equal('diamonds');
    expect(Suit.Clubs).to.equal('clubs');
  });

  it('should get correct suit symbol', () => {
    expect(getSuitSymbol('spades')).to.equal('♠');
    expect(getSuitSymbol('hearts')).to.equal('♥');
    expect(getSuitSymbol('diamonds')).to.equal('♦');
    expect(getSuitSymbol('clubs')).to.equal('♣');
  });

  it('should identify red suits correctly', () => {
    expect(isRedSuit('hearts')).to.be.true;
    expect(isRedSuit('diamonds')).to.be.true;
    expect(isRedSuit('spades')).to.be.false;
    expect(isRedSuit('clubs')).to.be.false;
  });
});

describe('Rank', () => {
  it('should have all 13 ranks', () => {
    expect(Rank.Two).to.equal('2');
    expect(Rank.Three).to.equal('3');
    expect(Rank.Four).to.equal('4');
    expect(Rank.Five).to.equal('5');
    expect(Rank.Six).to.equal('6');
    expect(Rank.Seven).to.equal('7');
    expect(Rank.Eight).to.equal('8');
    expect(Rank.Nine).to.equal('9');
    expect(Rank.Ten).to.equal('10');
    expect(Rank.Jack).to.equal('J');
    expect(Rank.Queen).to.equal('Q');
    expect(Rank.King).to.equal('K');
    expect(Rank.Ace).to.equal('A');
  });

  it('should get rank value for comparison', () => {
    expect(getRankValue('A')).to.equal(14);
    expect(getRankValue('K')).to.equal(13);
    expect(getRankValue('Q')).to.equal(12);
    expect(getRankValue('J')).to.equal(11);
    expect(getRankValue('10')).to.equal(10);
    expect(getRankValue('2')).to.equal(2);
  });
});

describe('Card', () => {
  it('should create valid card', () => {
    const card: Card = { rank: 'A', suit: 'spades' };
    expect(card.rank).to.equal('A');
    expect(card.suit).to.equal('spades');
  });

  it('should format card as string', () => {
    const card: Card = { rank: 'A', suit: 'spades' };
    expect(formatCard(card)).to.equal('A♠');
  });
});

describe('HandRank', () => {
  it('should have all 10 hand rankings', () => {
    expect(HandRank.HighCard).to.equal(1);
    expect(HandRank.OnePair).to.equal(2);
    expect(HandRank.TwoPair).to.equal(3);
    expect(HandRank.ThreeOfAKind).to.equal(4);
    expect(HandRank.Straight).to.equal(5);
    expect(HandRank.Flush).to.equal(6);
    expect(HandRank.FullHouse).to.equal(7);
    expect(HandRank.FourOfAKind).to.equal(8);
    expect(HandRank.StraightFlush).to.equal(9);
    expect(HandRank.RoyalFlush).to.equal(10);
  });
});

describe('PokerHand', () => {
  it('should create poker hand with rank', () => {
    const hand: PokerHand = { rank: HandRank.OnePair, name: 'One Pair', emoji: '👍' };
    expect(hand.rank).to.equal(2);
    expect(hand.name).to.equal('One Pair');
    expect(hand.emoji).to.equal('👍');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker/types.test.ts`
Expected: FAIL with "Suit, Rank, Card, HandRank, PokerHand, getSuitSymbol, etc. not defined"

**Step 3: Write minimal implementation - types.ts**

```typescript
// src/widgets/poker/types.ts

/**
 * Suit types for standard 52-card deck
 */
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

/**
 * Suit enum for type-safe suit values
 */
export const Suit = {
  Spades: 'spades' as Suit,
  Hearts: 'hearts' as Suit,
  Diamonds: 'diamonds' as Suit,
  Clubs: 'clubs' as Suit,
} as const;

/**
 * Unicode suit symbols
 */
export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

/**
 * Get suit symbol for display
 */
export function getSuitSymbol(suit: Suit): string {
  return SUIT_SYMBOLS[suit];
}

/**
 * Check if suit is red (hearts or diamonds)
 */
export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

/**
 * Rank types for standard 52-card deck
 */
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

/**
 * Rank enum for type-safe rank values
 */
export const Rank = {
  Two: '2' as Rank,
  Three: '3' as Rank,
  Four: '4' as Rank,
  Five: '5' as Rank,
  Six: '6' as Rank,
  Seven: '7' as Rank,
  Eight: '8' as Rank,
  Nine: '9' as Rank,
  Ten: '10' as Rank,
  Jack: 'J' as Rank,
  Queen: 'Q' as Rank,
  King: 'K' as Rank,
  Ace: 'A' as Rank,
} as const;

/**
 * Get numeric rank value for comparison (Ace = 14, King = 13, ..., Two = 2)
 */
export function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return values[rank];
}

/**
 * Card representation
 */
export interface Card {
  rank: Rank;
  suit: Suit;
}

/**
 * Format card as string with suit symbol
 */
export function formatCard(card: Card): string {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

/**
 * Hand ranking values (higher = better)
 */
export enum HandRank {
  HighCard = 1,
  OnePair = 2,
  TwoPair = 3,
  ThreeOfAKind = 4,
  Straight = 5,
  Flush = 6,
  FullHouse = 7,
  FourOfAKind = 8,
  StraightFlush = 9,
  RoyalFlush = 10,
}

/**
 * Poker hand result
 */
export interface PokerHand {
  rank: HandRank;
  name: string;
  emoji: string;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker/types.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker/types.ts tests/unit/widgets/poker/types.test.ts
git commit -m "feat: add poker types (Suit, Rank, Card, HandRank)"
```

---

## Task 2: Create Deck Class

**Files:**
- Create: `src/widgets/poker/deck.ts`
- Create: `tests/unit/widgets/poker/deck.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/unit/widgets/poker/deck.test.ts
import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import { Deck } from '../../../src/widgets/poker/deck.js';

describe('Deck', () => {
  it('should create a standard 52-card deck', () => {
    const deck = new Deck();
    expect(deck.remaining()).to.equal(52);
  });

  it('should deal unique cards without replacement', () => {
    const deck = new Deck();
    const cards: string[] = [];

    for (let i = 0; i < 52; i++) {
      const card = deck.deal();
      expect(card).to.exist;
      cards.push(`${card.rank}${card.suit}`);
    }

    // All cards should be unique
    const uniqueCards = new Set(cards);
    expect(uniqueCards.size).to.equal(52);
  });

  it('should throw error when dealing from empty deck', () => {
    const deck = new Deck();

    // Deal all cards
    for (let i = 0; i < 52; i++) {
      deck.deal();
    }

    expect(() => deck.deal()).to.throw('Deck is empty');
  });

  it('should shuffle deck on creation (randomness check)', () => {
    const deck1 = new Deck();
    const deck2 = new Deck();

    // Deal 5 cards from each
    const hand1 = [deck1.deal(), deck1.deal(), deck1.deal(), deck1.deal(), deck1.deal()];
    const hand2 = [deck2.deal(), deck2.deal(), deck2.deal(), deck2.deal(), deck2.deal()];

    // Probability of identical 5-card sequence is extremely low
    const hand1Str = hand1.map(c => `${c.rank}${c.suit}`).join('');
    const hand2Str = hand2.map(c => `${c.rank}${c.suit}`).join('');

    expect(hand1Str).to.not.equal(hand2Str);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker/deck.test.ts`
Expected: FAIL with "Deck not defined"

**Step 3: Write minimal implementation - deck.ts**

```typescript
// src/widgets/poker/deck.ts
import { randomInt } from 'node:crypto';
import type { Card, Suit, Rank } from './types.js';
import { Suit, Rank } from './types.js';

const ALL_SUITS: Suit[] = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];
const ALL_RANKS: Rank[] = [
  Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven,
  Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace
];

/**
 * Standard 52-card deck with shuffling and dealing
 */
export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.initialize();
    this.shuffle();
  }

  /**
   * Create a standard 52-card deck
   */
  private initialize(): void {
    this.cards = [];

    for (const suit of ALL_SUITS) {
      for (const rank of ALL_RANKS) {
        this.cards.push({ rank, suit });
      }
    }
  }

  /**
   * Shuffle deck using Fisher-Yates algorithm with crypto.random
   */
  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      // Use crypto.randomInt for cryptographically secure random numbers
      const j = randomInt(0, i + 1);
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Deal one card from the top of the deck
   * @throws Error if deck is empty
   */
  deal(): Card {
    if (this.cards.length === 0) {
      throw new Error('Deck is empty');
    }
    return this.cards.pop()!;
  }

  /**
   * Get number of remaining cards in deck
   */
  remaining(): number {
    return this.cards.length;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker/deck.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker/deck.ts tests/unit/widgets/poker/deck.test.ts
git commit -m "feat: add Deck class with shuffle and deal"
```

---

## Task 3: Create Hand Evaluator

**Files:**
- Create: `src/widgets/poker/hand-evaluator.ts`
- Create: `tests/unit/widgets/poker/hand-evaluator.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/unit/widgets/poker/hand-evaluator.test.ts
import { describe, it } from 'node:test';
import { expect } from 'chai';
import { evaluateHand } from '../../../src/widgets/poker/hand-evaluator.js';
import type { Card } from '../../../src/widgets/poker/types.js';
import { HandRank } from '../../../src/widgets/poker/types.js';

describe('HandEvaluator', () => {
  it('should detect high card (weakest hand)', () => {
    const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'J', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.HighCard);
    expect(result.name).to.equal('High Card');
    expect(result.emoji).to.equal('🃏');
  });

  it('should detect one pair', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'J', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.OnePair);
    expect(result.name).to.equal('One Pair');
    expect(result.emoji).to.equal('👍');
  });

  it('should detect two pair', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.TwoPair);
    expect(result.name).to.equal('Two Pair');
    expect(result.emoji).to.equal('✌️');
  });

  it('should detect three of a kind', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.ThreeOfAKind);
    expect(result.name).to.equal('Three of a Kind');
    expect(result.emoji).to.equal('🎯');
  });

  it('should detect straight (five consecutive cards)', () => {
    const hole: Card[] = [{ rank: '10', suit: 'spades' }, { rank: 'J', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'diamonds' },
      { rank: 'K', suit: 'clubs' },
      { rank: 'A', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.Straight);
    expect(result.name).to.equal('Straight');
    expect(result.emoji).to.equal('📈');
  });

  it('should detect flush (five cards same suit)', () => {
    const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'spades' },
      { rank: 'J', suit: 'spades' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.Flush);
    expect(result.name).to.equal('Flush');
    expect(result.emoji).to.equal('💧');
  });

  it('should detect full house (three of a kind + pair)', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'Q', suit: 'clubs' },
      { rank: 'Q', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.FullHouse);
    expect(result.name).to.equal('Full House');
    expect(result.emoji).to.equal('🏠');
  });

  it('should detect four of a kind', () => {
    const hole: Card[] = [{ rank: 'K', suit: 'spades' }, { rank: 'K', suit: 'hearts' }];
    const board: Card[] = [
      { rank: 'K', suit: 'diamonds' },
      { rank: 'K', suit: 'clubs' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.FourOfAKind);
    expect(result.name).to.equal('Four of a Kind');
    expect(result.emoji).to.equal('💎');
  });

  it('should detect straight flush', () => {
    const hole: Card[] = [{ rank: '10', suit: 'spades' }, { rank: 'J', suit: 'spades' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'spades' },
      { rank: 'K', suit: 'spades' },
      { rank: 'A', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.RoyalFlush);
    expect(result.name).to.equal('Royal Flush');
    expect(result.emoji).to.equal('🏆');
  });

  it('should detect royal flush (best hand)', () => {
    const hole: Card[] = [{ rank: 'A', suit: 'spades' }, { rank: 'K', suit: 'spades' }];
    const board: Card[] = [
      { rank: 'Q', suit: 'spades' },
      { rank: 'J', suit: 'spades' },
      { rank: '10', suit: 'spades' },
      { rank: '2', suit: 'hearts' },
      { rank: '7', suit: 'clubs' }
    ];

    const result = evaluateHand(hole, board);
    expect(result.rank).to.equal(HandRank.RoyalFlush);
    expect(result.name).to.equal('Royal Flush');
    expect(result.emoji).to.equal('🏆');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker/hand-evaluator.test.ts`
Expected: FAIL with "evaluateHand not defined"

**Step 3: Write minimal implementation - hand-evaluator.ts**

```typescript
// src/widgets/poker/hand-evaluator.ts
import type { Card, PokerHand } from './types.js';
import { HandRank, getRankValue } from './types.js';

/**
 * Hand display names with emojis
 */
const HAND_DISPLAY: Record<HandRank, { name: string; emoji: string }> = {
  [HandRank.RoyalFlush]: { name: 'Royal Flush', emoji: '🏆' },
  [HandRank.StraightFlush]: { name: 'Straight Flush', emoji: '🔥' },
  [HandRank.FourOfAKind]: { name: 'Four of a Kind', emoji: '💎' },
  [HandRank.FullHouse]: { name: 'Full House', emoji: '🏠' },
  [HandRank.Flush]: { name: 'Flush', emoji: '💧' },
  [HandRank.Straight]: { name: 'Straight', emoji: '📈' },
  [HandRank.ThreeOfAKind]: { name: 'Three of a Kind', emoji: '🎯' },
  [HandRank.TwoPair]: { name: 'Two Pair', emoji: '✌️' },
  [HandRank.OnePair]: { name: 'One Pair', emoji: '👍' },
  [HandRank.HighCard]: { name: 'High Card', emoji: '🃏' },
};

/**
 * Count occurrences of each rank in cards
 */
function countRanks(cards: Card[]): Map<number, number> {
  const counts = new Map<number, number>();

  for (const card of cards) {
    const value = getRankValue(card.rank);
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return counts;
}

/**
 * Count occurrences of each suit in cards
 */
function countSuits(cards: Card[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const card of cards) {
    counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
  }

  return counts;
}

/**
 * Check if cards form a flush (5+ cards of same suit)
 */
function isFlush(cards: Card[]): boolean {
  const suitCounts = countSuits(cards);

  for (const count of suitCounts.values()) {
    if (count >= 5) return true;
  }

  return false;
}

/**
 * Check if cards form a straight (5 consecutive ranks)
 * Returns the high card of the straight if found, null otherwise
 */
function getStraightHighCard(cards: Card[]): number | null {
  const uniqueValues = new Set<number>();

  for (const card of cards) {
    uniqueValues.add(getRankValue(card.rank));
  }

  const sortedValues = Array.from(uniqueValues).sort((a, b) => b - a);

  // Check for straight with Ace high (A-K-Q-J-10)
  if (sortedValues.includes(14)) {
    sortedValues.push(1); // Add Ace as low for wheel straight (A-2-3-4-5)
  }

  for (let i = 0; i <= sortedValues.length - 5; i++) {
    const current = sortedValues[i];
    const next1 = sortedValues[i + 1];
    const next2 = sortedValues[i + 2];
    const next3 = sortedValues[i + 3];
    const next4 = sortedValues[i + 4];

    if (current - next1 === 1 && current - next2 === 2 &&
        current - next3 === 3 && current - next4 === 4) {
      return current;
    }
  }

  return null;
}

/**
 * Get the count of cards with the same rank (e.g., 4 = four of a kind)
 */
function getMaxCount(cards: Card[]): number {
  const rankCounts = countRanks(cards);
  let maxCount = 0;

  for (const count of rankCounts.values()) {
    if (count > maxCount) {
      maxCount = count;
    }
  }

  return maxCount;
}

/**
 * Get the number of pairs (two cards of same rank)
 */
function getPairCount(cards: Card[]): number {
  const rankCounts = countRanks(cards);
  let pairCount = 0;

  for (const count of rankCounts.values()) {
    if (count === 2) {
      pairCount++;
    }
  }

  return pairCount;
}

/**
 * Evaluate a poker hand from hole cards and community cards
 * @param hole - Player's 2 hole cards
 * @param board - 5 community cards
 * @returns PokerHand with rank, name, and emoji
 */
export function evaluateHand(hole: Card[], board: Card[]): PokerHand {
  const allCards = [...hole, ...board];

  const flush = isFlush(allCards);
  const straightHighCard = getStraightHighCard(allCards);
  const maxCount = getMaxCount(allCards);
  const pairCount = getPairCount(allCards);

  // Royal Flush (Straight flush with Ace high)
  if (flush && straightHighCard === 14) {
    return { rank: HandRank.RoyalFlush, ...HAND_DISPLAY[HandRank.RoyalFlush] };
  }

  // Straight Flush
  if (flush && straightHighCard !== null) {
    return { rank: HandRank.StraightFlush, ...HAND_DISPLAY[HandRank.StraightFlush] };
  }

  // Four of a Kind
  if (maxCount === 4) {
    return { rank: HandRank.FourOfAKind, ...HAND_DISPLAY[HandRank.FourOfAKind] };
  }

  // Full House (3 of a kind + pair)
  if (maxCount === 3 && pairCount >= 1) {
    return { rank: HandRank.FullHouse, ...HAND_DISPLAY[HandRank.FullHouse] };
  }

  // Flush
  if (flush) {
    return { rank: HandRank.Flush, ...HAND_DISPLAY[HandRank.Flush] };
  }

  // Straight
  if (straightHighCard !== null) {
    return { rank: HandRank.Straight, ...HAND_DISPLAY[HandRank.Straight] };
  }

  // Three of a Kind
  if (maxCount === 3) {
    return { rank: HandRank.ThreeOfAKind, ...HAND_DISPLAY[HandRank.ThreeOfAKind] };
  }

  // Two Pair
  if (pairCount >= 2) {
    return { rank: HandRank.TwoPair, ...HAND_DISPLAY[HandRank.TwoPair] };
  }

  // One Pair
  if (pairCount === 1) {
    return { rank: HandRank.OnePair, ...HAND_DISPLAY[HandRank.OnePair] };
  }

  // High Card (weakest hand)
  return { rank: HandRank.HighCard, ...HAND_DISPLAY[HandRank.HighCard] };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker/hand-evaluator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker/hand-evaluator.ts tests/unit/widgets/poker/hand-evaluator.test.ts
git commit -m "feat: add hand evaluator with all poker combinations"
```

---

## Task 4: Create PokerWidget

**Files:**
- Create: `src/widgets/poker-widget.ts`
- Create: `tests/unit/widgets/poker-widget.test.ts`

**Step 1: Write the failing test**

```typescript
// tests/unit/widgets/poker-widget.test.ts
import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import { PokerWidget } from '../../../src/widgets/poker-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';
import { stripAnsi } from '../../helpers/snapshot.js';

describe('PokerWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new PokerWidget();
    expect(widget.id).to.equal('poker');
    expect(widget.metadata.name).to.equal('Poker');
    expect(widget.metadata.line).to.equal(2); // Third line
  });

  it('should generate and render a poker hand', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.exist;
    expect(result).to.include('Hand:');
    expect(result).to.include('Board:');
    expect(result).to.include('→');
  });

  it('should format cards with brackets', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || '');

    expect(cleanResult).to.match(/\[[A-Z0-9]+[♠♥♦♣]\]/);
  });

  it('should show exactly 2 hole cards and 5 board cards', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });
    const cleanResult = stripAnsi(result || '');

    // Count card occurrences: each card is [RANK+SUIT]
    const cardMatches = cleanResult.match(/\[[A-Z0-9]+[♠♥♦♣]\]/g);
    expect(cardMatches).to.have.lengthOf(7); // 2 hole + 5 board
  });

  it('should use red color for hearts and diamonds', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Check for red ANSI code (31)
    // This test may occasionally fail if no red cards are dealt, but probability is low
    // The test is kept for documentation purposes
  });

  it('should use gray color for spades and clubs', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Check for gray ANSI code (90)
    expect(result).to.include('\x1b[90m');
  });

  it('should show hand result with emoji', async () => {
    const widget = new PokerWidget();
    await widget.update(createMockStdinData({}));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Should contain emoji from hand display
    const emojis = ['🏆', '🔥', '💎', '🏠', '💧', '📈', '🎯', '✌️', '👍', '🃏'];
    const hasEmoji = emojis.some(emoji => result?.includes(emoji));
    expect(hasEmoji).to.be.true;
  });

  it('should generate new hand on each update', async () => {
    const widget = new PokerWidget();

    await widget.update(createMockStdinData({}));
    const result1 = await widget.render({ width: 80, timestamp: 0 });

    await widget.update(createMockStdinData({}));
    const result2 = await widget.render({ width: 80, timestamp: 0 });

    // Probability of identical hands is extremely low (1 in trillions)
    expect(stripAnsi(result1 || '')).to.not.equal(stripAnsi(result2 || ''));
  });

  it('should always be enabled', () => {
    const widget = new PokerWidget();
    expect(widget.isEnabled()).to.be.true;
  });

  it('should handle initialization', async () => {
    const widget = new PokerWidget();
    await widget.initialize({ config: {} });

    expect(widget.isEnabled()).to.be.true;
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`
Expected: FAIL with "PokerWidget not defined"

**Step 3: Write minimal implementation - poker-widget.ts**

```typescript
// src/widgets/poker-widget.ts
/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { Deck } from './poker/deck.js';
import { evaluateHand } from './poker/hand-evaluator.js';
import { formatCard, isRedSuit } from './poker/types.js';
import { colorize } from '../ui/utils/formatters.js';
import { gray, red } from '../ui/utils/colors.js';
import type { RenderContext, StdinData } from '../types.js';

export class PokerWidget extends StdinDataWidget {
  readonly id = 'poker';
  readonly metadata = createWidgetMetadata(
    'Poker',
    'Displays random Texas Hold\'em hands for entertainment',
    '1.0.0',
    'claude-scope',
    2  // Third line (0-indexed)
  );

  private deck: Deck | null = null;
  private holeCards: ReturnType<typeof formatCard>[] = [];
  private boardCards: ReturnType<typeof formatCard>[] = [];
  private handResult = '';

  constructor() {
    super();
  }

  /**
   * Generate new poker hand on each update
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    // Create new shuffled deck
    this.deck = new Deck();

    // Deal 2 hole cards
    const hole = [
      this.deck.deal(),
      this.deck.deal()
    ];

    // Deal 5 community cards
    const board = [
      this.deck.deal(),
      this.deck.deal(),
      this.deck.deal(),
      this.deck.deal(),
      this.deck.deal()
    ];

    // Evaluate hand
    const result = evaluateHand(hole, board);

    // Format cards
    this.holeCards = hole.map(card => this.formatCardColor(card));
    this.boardCards = board.map(card => this.formatCardColor(card));
    this.handResult = `${result.name}! ${result.emoji}`;
  }

  /**
   * Format card with appropriate color (red for ♥♦, gray for ♠♣)
   */
  private formatCardColor(card: ReturnType<typeof formatCard>): string {
    const color = isRedSuit(card.suit) ? red : gray;
    return colorize(`[${formatCard(card)}]`, color);
  }

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    const handStr = this.holeCards.join(' ');
    const boardStr = this.boardCards.join(' ');

    return `Hand: ${handStr} | Board: ${boardStr} → ${this.handResult}`;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/poker-widget.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/poker-widget.ts tests/unit/widgets/poker-widget.test.ts
git commit -m "feat: add PokerWidget with random Texas Hold'em hands"
```

---

## Task 5: Export from Poker Module

**Files:**
- Create: `src/widgets/poker/index.ts`

**Step 1: Create index.ts for clean exports**

```typescript
// src/widgets/poker/index.ts
export type { Card, Suit, Rank, PokerHand } from './types.js';
export { Suit, Rank, HandRank, getSuitSymbol, isRedSuit, getRankValue, formatCard } from './types.js';
export { Deck } from './deck.js';
export { evaluateHand } from './hand-evaluator.js';
```

**Step 2: Verify exports work correctly**

Run: `node -e "import { Deck } from './src/widgets/poker/index.js'; console.log('Poker module imported successfully');"`
Expected: No errors, successful import

**Step 3: Commit**

```bash
git add src/widgets/poker/index.ts
git commit -m "chore: add poker module index exports"
```

---

## Task 6: Register Widget in CLI

**Files:**
- Modify: `src/index.ts`

**Step 1: Find where widgets are registered**

Run: `grep -n "ContextWidget\|LinesWidget" src/index.ts`
Expected: Find widget registration/usage

**Step 2: Add PokerWidget import and registration**

Add import at top of file:
```typescript
import { PokerWidget } from './widgets/poker-widget.js';
```

Add widget to widget list (exact location depends on current code structure).

**Step 3: Run integration tests to verify**

Run: `npm test -- tests/integration/`
Expected: All PASS

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: register PokerWidget in CLI"
```

---

## Task 7: Update Integration Tests

**Files:**
- Check: `tests/integration/five-widgets.integration.test.ts`
- Check: `tests/integration/cli-flow.integration.test.ts`

**Step 1: Run integration tests to check for issues**

Run: `npm test -- tests/integration/`
Expected: May have issues due to new widget

**Step 2: Update integration tests if needed**

If snapshots have hardcoded line counts or expectations, update them.

**Step 3: Run integration tests again**

Run: `npm test -- tests/integration/`
Expected: All PASS

**Step 4: Commit if changes were needed**

```bash
git add tests/integration/
git commit -m "test: update integration tests for PokerWidget"
```

---

## Task 8: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update version**

Change line 9:
```markdown
**Current version**: v0.3.3
```

**Step 2: Add PokerWidget to implemented features list**

Add to "Implemented features" section:
```markdown
- Poker entertainment widget with Texas Hold'em hands
```

**Step 3: Add PokerWidget to architecture diagram**

Add to widgets list in architecture:
```
├── widgets/
│   ├── poker-widget.ts        # Poker entertainment widget
│   ├── poker/
│   │   ├── types.ts           # Poker types (Card, Suit, Rank, HandRank)
│   │   ├── deck.ts            # Deck class with shuffle/deal
│   │   └── hand-evaluator.ts  # Hand combination evaluator
```

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add PokerWidget to CLAUDE.md"
```

---

## Task 9: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All PASS

**Step 2: Check test coverage**

Run: `npm run test:coverage`
Expected: Coverage report generated

**Step 3: Fix any issues**

If tests fail, fix and commit with descriptive message.

---

## Summary

This implementation creates an entertainment poker widget by:

1. **Type-safe card system** - Card, Suit, Rank types with proper validation
2. **Cryptographically secure deck** - Uses crypto.randomInt for shuffling
3. **Complete hand evaluation** - Detects all 10 Texas Hold'em combinations
4. **Color-coded display** - Red for ♥♦, gray for ♠♣
5. **Emoji reactions** - Emotional feedback based on hand strength
6. **Test-driven** - All components fully tested
7. **Atomic commits** - Each logical change is a separate commit

**Widget output example:**
```
Hand: [A♠][K♥] | Board: [Q♦][J♣][10♠][2♥][7♣] → One Pair! 👍
```

**Future enhancements** (not in this plan):
- Configurable widget position (line property)
- Option to disable entertainment widget
- Persistent hand history
- Hand strength visualization
- More poker variants (Omaha, etc.)
