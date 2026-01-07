/**
 * Suit types for standard 52-card deck
 */
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
/**
 * Suit enum for type-safe suit values
 */
export declare const Suit: {
    readonly Spades: Suit;
    readonly Hearts: Suit;
    readonly Diamonds: Suit;
    readonly Clubs: Suit;
};
/**
 * Unicode suit symbols
 */
export declare const SUIT_SYMBOLS: Record<Suit, string>;
/**
 * Get suit symbol for display
 */
export declare function getSuitSymbol(suit: Suit): string;
/**
 * Check if suit is red (hearts or diamonds)
 */
export declare function isRedSuit(suit: Suit): boolean;
/**
 * Rank types for standard 52-card deck
 */
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
/**
 * Rank enum for type-safe rank values
 */
export declare const Rank: {
    readonly Two: Rank;
    readonly Three: Rank;
    readonly Four: Rank;
    readonly Five: Rank;
    readonly Six: Rank;
    readonly Seven: Rank;
    readonly Eight: Rank;
    readonly Nine: Rank;
    readonly Ten: Rank;
    readonly Jack: Rank;
    readonly Queen: Rank;
    readonly King: Rank;
    readonly Ace: Rank;
};
/**
 * Get numeric rank value for comparison (Ace = 14, King = 13, ..., Two = 2)
 */
export declare function getRankValue(rank: Rank): number;
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
export declare function formatCard(card: Card): string;
/**
 * Hand ranking values (higher = better)
 */
export declare enum HandRank {
    HighCard = 1,
    OnePair = 2,
    TwoPair = 3,
    ThreeOfAKind = 4,
    Straight = 5,
    Flush = 6,
    FullHouse = 7,
    FourOfAKind = 8,
    StraightFlush = 9,
    RoyalFlush = 10
}
/**
 * Poker hand result
 */
export interface PokerHand {
    rank: HandRank;
    name: string;
    emoji: string;
}
//# sourceMappingURL=types.d.ts.map