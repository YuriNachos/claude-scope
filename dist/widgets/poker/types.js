/**
 * Suit enum for type-safe suit values
 */
export const Suit = {
    Spades: 'spades',
    Hearts: 'hearts',
    Diamonds: 'diamonds',
    Clubs: 'clubs',
};
/**
 * Unicode suit symbols
 */
export const SUIT_SYMBOLS = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
};
/**
 * Get suit symbol for display
 */
export function getSuitSymbol(suit) {
    return SUIT_SYMBOLS[suit];
}
/**
 * Check if suit is red (hearts or diamonds)
 */
export function isRedSuit(suit) {
    return suit === 'hearts' || suit === 'diamonds';
}
/**
 * Rank enum for type-safe rank values
 */
export const Rank = {
    Two: '2',
    Three: '3',
    Four: '4',
    Five: '5',
    Six: '6',
    Seven: '7',
    Eight: '8',
    Nine: '9',
    Ten: '10',
    Jack: 'J',
    Queen: 'Q',
    King: 'K',
    Ace: 'A',
};
/**
 * Get numeric rank value for comparison (Ace = 14, King = 13, ..., Two = 2)
 */
export function getRankValue(rank) {
    const values = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return values[rank];
}
/**
 * Format card as string with suit symbol
 */
export function formatCard(card) {
    return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}
/**
 * Hand ranking values (higher = better)
 */
export var HandRank;
(function (HandRank) {
    HandRank[HandRank["HighCard"] = 1] = "HighCard";
    HandRank[HandRank["OnePair"] = 2] = "OnePair";
    HandRank[HandRank["TwoPair"] = 3] = "TwoPair";
    HandRank[HandRank["ThreeOfAKind"] = 4] = "ThreeOfAKind";
    HandRank[HandRank["Straight"] = 5] = "Straight";
    HandRank[HandRank["Flush"] = 6] = "Flush";
    HandRank[HandRank["FullHouse"] = 7] = "FullHouse";
    HandRank[HandRank["FourOfAKind"] = 8] = "FourOfAKind";
    HandRank[HandRank["StraightFlush"] = 9] = "StraightFlush";
    HandRank[HandRank["RoyalFlush"] = 10] = "RoyalFlush";
})(HandRank || (HandRank = {}));
//# sourceMappingURL=types.js.map