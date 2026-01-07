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
