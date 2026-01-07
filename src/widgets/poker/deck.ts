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
