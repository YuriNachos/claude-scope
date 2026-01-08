/**
 * Suit types for standard 52-card deck
 */
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";

/**
 * Suit enum for type-safe suit values
 */
export const Suit = {
  Spades: "spades" as Suit,
  Hearts: "hearts" as Suit,
  Diamonds: "diamonds" as Suit,
  Clubs: "clubs" as Suit,
} as const;

/**
 * Unicode suit symbols
 */
export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

/**
 * Emoji suit symbols (colorful versions with variation selector)
 */
export const EMOJI_SYMBOLS: Record<Suit, string> = {
  spades: "\u2660\uFE0F", // ♠️
  hearts: "\u2665\uFE0F", // ♥️
  diamonds: "\u2666\uFE0F", // ♦️
  clubs: "\u2663\uFE0F", // ♣️
};

/**
 * Get suit symbol for display
 */
export function getSuitSymbol(suit: Suit): string {
  return SUIT_SYMBOLS[suit];
}

/**
 * Get emoji suit symbol for display
 */
export function getEmojiSymbol(suit: Suit): string {
  return EMOJI_SYMBOLS[suit];
}

/**
 * Check if suit is red (hearts or diamonds)
 */
export function isRedSuit(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}

/**
 * Rank types for standard 52-card deck
 */
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

/**
 * Rank enum for type-safe rank values
 */
export const Rank = {
  Two: "2" as Rank,
  Three: "3" as Rank,
  Four: "4" as Rank,
  Five: "5" as Rank,
  Six: "6" as Rank,
  Seven: "7" as Rank,
  Eight: "8" as Rank,
  Nine: "9" as Rank,
  Ten: "10" as Rank,
  Jack: "J" as Rank,
  Queen: "Q" as Rank,
  King: "K" as Rank,
  Ace: "A" as Rank,
} as const;

/**
 * Get numeric rank value for comparison (Ace = 14, King = 13, ..., Two = 2)
 */
export function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
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
 * Format card as string with emoji suit symbol
 */
export function formatCardEmoji(card: Card): string {
  return `${card.rank}${EMOJI_SYMBOLS[card.suit]}`;
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
  /** Indices of cards (from all 7 cards) that form the hand */
  participatingCards: number[];
}
