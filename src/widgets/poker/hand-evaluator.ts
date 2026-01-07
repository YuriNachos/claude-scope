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
 * Find indices of cards with a specific rank value
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
 * Find indices of cards with a specific suit
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
 * Find the suit that has 5+ cards (for flush)
 */
function findFlushSuit(cards: Card[]): string | null {
  const suitCounts = countSuits(cards);
  for (const [suit, count] of suitCounts.entries()) {
    if (count >= 5) return suit;
  }
  return null;
}

/**
 * Get indices for a straight ending with the given high card
 */
function getStraightIndices(cards: Card[], highCard: number): number[] {
  const uniqueValues = new Set<number>();
  const cardIndicesByRank = new Map<number, number[]>();

  // Build a map of rank values to card indices
  for (let i = 0; i < cards.length; i++) {
    const value = getRankValue(cards[i].rank);
    if (!cardIndicesByRank.has(value)) {
      cardIndicesByRank.set(value, []);
      uniqueValues.add(value);
    }
    cardIndicesByRank.get(value)!.push(i);
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
      if (current === highCard) {
        // Found the straight, get one card index for each rank
        const indices: number[] = [];
        indices.push(cardIndicesByRank.get(current)![0]);
        indices.push(cardIndicesByRank.get(next1)![0]);
        indices.push(cardIndicesByRank.get(next2)![0]);
        indices.push(cardIndicesByRank.get(next3)![0]);
        indices.push(cardIndicesByRank.get(next4)![0]);
        return indices;
      }
    }
  }

  return [];
}

/**
 * Check if a straight flush exists for a specific suit
 * Returns the high card if found, null otherwise
 */
function getStraightFlushHighCard(cards: Card[], suit: string): number | null {
  const suitCards = cards.filter(c => c.suit === suit);
  return getStraightHighCard(suitCards);
}

/**
 * Get indices for a straight flush with the given high card and suit
 */
function getStraightFlushIndices(cards: Card[], highCard: number, suit: string): number[] {
  const suitCards = cards.filter(c => c.suit === suit);
  const suitCardIndices: Card[] = [];

  // Map filtered cards back to original indices
  const indexMap = new Map<number, number>();
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit === suit) {
      indexMap.set(suitCardIndices.length, i);
      suitCardIndices.push(cards[i]);
    }
  }

  const indices = getStraightIndices(suitCardIndices, highCard);
  // Map back to original indices
  return indices.map(idx => indexMap.get(idx)!);
}

/**
 * Get indices for full house (3 of a kind + pair)
 */
function getFullHouseIndices(cards: Card[]): number[] {
  const rankCounts = countRanks(cards);

  // Find three of a kind rank
  let tripsRank = 0;
  for (const [rank, count] of rankCounts.entries()) {
    if (count === 3) {
      tripsRank = rank;
      break;
    }
  }

  // Find pair rank
  let pairRank = 0;
  for (const [rank, count] of rankCounts.entries()) {
    if (count >= 2 && rank !== tripsRank) {
      pairRank = rank;
      break;
    }
  }

  // If we have two trips, use the higher as pair
  if (pairRank === 0) {
    const tripsRanks: number[] = [];
    for (const [rank, count] of rankCounts.entries()) {
      if (count === 3) {
        tripsRanks.push(rank);
      }
    }
    if (tripsRanks.length >= 2) {
      tripsRanks.sort((a, b) => b - a);
      tripsRank = tripsRanks[0];
      pairRank = tripsRanks[1];
    }
  }

  const tripsIndices = findCardsOfRank(cards, tripsRank);
  const pairIndices = findCardsOfRank(cards, pairRank);

  return [...tripsIndices.slice(0, 3), ...pairIndices.slice(0, 2)];
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
 * Get the rank value that appears the most times
 */
function getMostCommonRank(cards: Card[]): number | null {
  const rankCounts = countRanks(cards);
  let bestRank = 0;
  let bestCount = 0;

  for (const [rank, count] of rankCounts.entries()) {
    if (count > bestCount) {
      bestCount = count;
      bestRank = rank;
    }
  }

  return bestRank > 0 ? bestRank : null;
}

/**
 * Get the highest two pair ranks
 */
function getTwoPairRanks(cards: Card[]): number[] {
  const rankCounts = countRanks(cards);
  const pairRanks: number[] = [];

  for (const [rank, count] of rankCounts.entries()) {
    if (count >= 2) {
      pairRanks.push(rank);
    }
  }

  pairRanks.sort((a, b) => b - a);
  return pairRanks.slice(0, 2);
}

/**
 * Get index of the highest card
 */
function getHighestCardIndex(cards: Card[]): number {
  let highestIdx = 0;
  let highestValue = 0;

  for (let i = 0; i < cards.length; i++) {
    const value = getRankValue(cards[i].rank);
    if (value > highestValue) {
      highestValue = value;
      highestIdx = i;
    }
  }

  return highestIdx;
}

/**
 * Evaluate a poker hand from hole cards and community cards
 * @param hole - Player's 2 hole cards
 * @param board - 5 community cards
 * @returns PokerHand with rank, name, emoji, and participating card indices
 */
export function evaluateHand(hole: Card[], board: Card[]): PokerHand {
  const allCards = [...hole, ...board];

  const flush = isFlush(allCards);
  const straightHighCard = getStraightHighCard(allCards);
  const maxCount = getMaxCount(allCards);
  const pairCount = getPairCount(allCards);

  // Royal Flush (Straight flush with Ace high)
  if (flush && straightHighCard === 14) {
    const flushSuit = findFlushSuit(allCards)!;
    const sfHighCard = getStraightFlushHighCard(allCards, flushSuit);
    if (sfHighCard === 14) {
      const participatingCards = getStraightFlushIndices(allCards, 14, flushSuit);
      return { rank: HandRank.RoyalFlush, ...HAND_DISPLAY[HandRank.RoyalFlush], participatingCards };
    }
  }

  // Straight Flush
  if (flush) {
    const flushSuit = findFlushSuit(allCards)!;
    const sfHighCard = getStraightFlushHighCard(allCards, flushSuit);
    if (sfHighCard !== null) {
      const participatingCards = getStraightFlushIndices(allCards, sfHighCard, flushSuit);
      return { rank: HandRank.StraightFlush, ...HAND_DISPLAY[HandRank.StraightFlush], participatingCards };
    }
  }

  // Four of a Kind
  if (maxCount === 4) {
    const rank = getMostCommonRank(allCards)!;
    const participatingCards = findCardsOfRank(allCards, rank);
    return { rank: HandRank.FourOfAKind, ...HAND_DISPLAY[HandRank.FourOfAKind], participatingCards };
  }

  // Full House (3 of a kind + pair)
  if (maxCount === 3 && pairCount >= 1) {
    const participatingCards = getFullHouseIndices(allCards);
    return { rank: HandRank.FullHouse, ...HAND_DISPLAY[HandRank.FullHouse], participatingCards };
  }

  // Flush
  if (flush) {
    const flushSuit = findFlushSuit(allCards)!;
    const suitIndices = findCardsOfSuit(allCards, flushSuit);
    const participatingCards = suitIndices.slice(0, 5);
    return { rank: HandRank.Flush, ...HAND_DISPLAY[HandRank.Flush], participatingCards };
  }

  // Straight
  if (straightHighCard !== null) {
    const participatingCards = getStraightIndices(allCards, straightHighCard);
    return { rank: HandRank.Straight, ...HAND_DISPLAY[HandRank.Straight], participatingCards };
  }

  // Three of a Kind
  if (maxCount === 3) {
    const rank = getMostCommonRank(allCards)!;
    const participatingCards = findCardsOfRank(allCards, rank);
    return { rank: HandRank.ThreeOfAKind, ...HAND_DISPLAY[HandRank.ThreeOfAKind], participatingCards };
  }

  // Two Pair
  if (pairCount >= 2) {
    const [rank1, rank2] = getTwoPairRanks(allCards);
    const pair1Indices = findCardsOfRank(allCards, rank1);
    const pair2Indices = findCardsOfRank(allCards, rank2);
    const participatingCards = [...pair1Indices, ...pair2Indices];
    return { rank: HandRank.TwoPair, ...HAND_DISPLAY[HandRank.TwoPair], participatingCards };
  }

  // One Pair
  if (pairCount === 1) {
    const rank = getMostCommonRank(allCards)!;
    const participatingCards = findCardsOfRank(allCards, rank);
    return { rank: HandRank.OnePair, ...HAND_DISPLAY[HandRank.OnePair], participatingCards };
  }

  // High Card (weakest hand)
  const highestIdx = getHighestCardIndex(allCards);
  return { rank: HandRank.HighCard, ...HAND_DISPLAY[HandRank.HighCard], participatingCards: [highestIdx] };
}
