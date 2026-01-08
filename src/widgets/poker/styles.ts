/**
 * Functional style renderers for PokerWidget
 */

import { bold, gray, lightGray, red, reset } from "../../ui/utils/colors.js";
import { colorize } from "../../ui/utils/formatters.js";
import { formatCard, formatCardEmoji, isRedSuit, type Card } from "./types.js";
import type { PokerCardData, PokerRenderData } from "./widget-types.js";
import type { StyleMap } from "../../core/style-types.js";

const HAND_ABBREVIATIONS: Record<string, string> = {
  "Royal Flush": "RF",
  "Straight Flush": "SF",
  "Four of a Kind": "4K",
  "Full House": "FH",
  "Flush": "FL",
  "Straight": "ST",
  "Three of a Kind": "3K",
  "Two Pair": "2P",
  "One Pair": "1P",
  "High Card": "HC",
  "Nothing": "—",
};

/**
 * Format card with color and optional participation formatting
 */
function formatCardByParticipation(
  cardData: PokerCardData,
  isParticipating: boolean
): string {
  const color = isRedSuit(cardData.card.suit) ? red : gray;
  const cardText = formatCard(cardData.card);

  if (isParticipating) {
    return `${color}${bold}(${cardText})${reset} `;
  } else {
    return `${color}${cardText}${reset} `;
  }
}

/**
 * Format card with compact notation
 */
function formatCardCompact(cardData: PokerCardData, isParticipating: boolean): string {
  const color = isRedSuit(cardData.card.suit) ? red : gray;
  const cardText = formatCardTextCompact(cardData.card);

  if (isParticipating) {
    return `${color}${bold}(${cardText})${reset}`;
  } else {
    return `${color}${cardText}${reset}`;
  }
}

/**
 * Format card text in compact notation (T for 10, etc)
 */
function formatCardTextCompact(card: Card): string {
  const rankSymbols: Record<string, string> = {
    "10": "T",
    "11": "J",
    "12": "Q",
    "13": "K",
    "14": "A",
  };
  const rank = String(card.rank);
  const rankSymbol = rankSymbols[rank] ?? rank;

  return `${rankSymbol}${card.suit}`;
}

/**
 * Format card with emoji suit symbols
 */
function formatCardEmojiByParticipation(
  cardData: PokerCardData,
  isParticipating: boolean
): string {
  const cardText = formatCardEmoji(cardData.card);

  if (isParticipating) {
    return `${bold}(${cardText})${reset} `;
  } else {
    return `${cardText} `;
  }
}

/**
 * Format hand result with emoji
 */
function formatHandResult(handResult: PokerRenderData["handResult"]): string {
  if (!handResult) {
    return "—";
  }

  const playerParticipates = handResult.participatingIndices.some((idx) => idx < 2);

  if (!playerParticipates) {
    return `Nothing 🃏`;
  } else {
    return `${handResult.name}! ${handResult.emoji}`;
  }
}

/**
 * Get hand abbreviation for compact-verbose style
 */
function getHandAbbreviation(handResult: PokerRenderData["handResult"]): string {
  if (!handResult) {
    return "— (—)";
  }

  const abbreviation = HAND_ABBREVIATIONS[handResult.name] ?? "—";

  return `${abbreviation} (${handResult.name})`;
}

export const pokerStyles: StyleMap<PokerRenderData> = {
  balanced: (data: PokerRenderData) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);

    const handStr = holeCards
      .map((hc, idx) => formatCardByParticipation(hc, participatingSet.has(idx)))
      .join("");

    const boardStr = boardCards
      .map((bc, idx) => formatCardByParticipation(bc, participatingSet.has(idx + 2)))
      .join("");

    const handLabel = colorize("Hand:", lightGray);
    const boardLabel = colorize("Board:", lightGray);

    return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}→ ${formatHandResult(handResult)}`;
  },

  compact: (data: PokerRenderData) => {
    // Same as balanced for now
    return pokerStyles.balanced!(data);
  },

  playful: (data: PokerRenderData) => {
    // Same as balanced for now
    return pokerStyles.balanced!(data);
  },

  "compact-verbose": (data: PokerRenderData) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);

    const handStr = holeCards
      .map((hc, idx) => formatCardCompact(hc, participatingSet.has(idx)))
      .join("");

    const boardStr = boardCards
      .map((bc, idx) => formatCardCompact(bc, participatingSet.has(idx + 2)))
      .join("");

    const abbreviation = getHandAbbreviation(handResult);

    return `${handStr}| ${boardStr}→ ${abbreviation}`;
  },

  emoji: (data: PokerRenderData) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);

    const handStr = holeCards
      .map((hc, idx) => formatCardEmojiByParticipation(hc, participatingSet.has(idx)))
      .join("");

    const boardStr = boardCards
      .map((bc, idx) => formatCardEmojiByParticipation(bc, participatingSet.has(idx + 2)))
      .join("");

    const handLabel = colorize("Hand:", lightGray);
    const boardLabel = colorize("Board:", lightGray);

    return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}→ ${formatHandResult(handResult)}`;
  },
};
