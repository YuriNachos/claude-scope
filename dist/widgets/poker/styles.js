/**
 * Functional style renderers for PokerWidget
 */
import { bold, gray, lightGray, red, reset } from "../../ui/utils/colors.js";
import { colorize } from "../../ui/utils/formatters.js";
import { formatCard, formatCardEmoji, isRedSuit } from "./types.js";
const HAND_ABBREVIATIONS = {
    "Royal Flush": "RF",
    "Straight Flush": "SF",
    "Four of a Kind": "4K",
    "Full House": "FH",
    Flush: "FL",
    Straight: "ST",
    "Three of a Kind": "3K",
    "Two Pair": "2P",
    "One Pair": "1P",
    "High Card": "HC",
    Nothing: "—",
};
/**
 * Format card with color and optional participation formatting
 */
function formatCardByParticipation(cardData, isParticipating) {
    const color = isRedSuit(cardData.card.suit) ? red : gray;
    const cardText = formatCard(cardData.card);
    if (isParticipating) {
        return `${color}${bold}(${cardText})${reset} `;
    }
    else {
        return `${color}${cardText}${reset} `;
    }
}
/**
 * Format card with compact notation
 */
function formatCardCompact(cardData, isParticipating) {
    const color = isRedSuit(cardData.card.suit) ? red : gray;
    const cardText = formatCardTextCompact(cardData.card);
    if (isParticipating) {
        return `${color}${bold}(${cardText})${reset}`;
    }
    else {
        return `${color}${cardText}${reset}`;
    }
}
/**
 * Format card text in compact notation (T for 10, etc)
 */
function formatCardTextCompact(card) {
    const rankSymbols = {
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
function formatCardEmojiByParticipation(cardData, isParticipating) {
    const cardText = formatCardEmoji(cardData.card);
    if (isParticipating) {
        return `${bold}(${cardText})${reset} `;
    }
    else {
        return `${cardText} `;
    }
}
/**
 * Format hand result with emoji
 */
function formatHandResult(handResult, colors) {
    if (!handResult) {
        return "—";
    }
    const playerParticipates = handResult.participatingIndices.some((idx) => idx < 2);
    const resultText = !playerParticipates ? `Nothing 🃏` : `${handResult.name}! ${handResult.emoji}`;
    if (!colors)
        return resultText;
    return colorize(resultText, colors.result);
}
/**
 * Get hand abbreviation for compact-verbose style
 */
function getHandAbbreviation(handResult) {
    if (!handResult) {
        return "— (—)";
    }
    const abbreviation = HAND_ABBREVIATIONS[handResult.name] ?? "—";
    return `${abbreviation} (${handResult.name})`;
}
export const pokerStyles = {
    balanced: (data, colors) => {
        const { holeCards, boardCards, handResult } = data;
        const participatingSet = new Set(handResult?.participatingIndices || []);
        const handStr = holeCards
            .map((hc, idx) => formatCardByParticipation(hc, participatingSet.has(idx)))
            .join("");
        const boardStr = boardCards
            .map((bc, idx) => formatCardByParticipation(bc, participatingSet.has(idx + 2)))
            .join("");
        const labelColor = colors?.participating ?? lightGray;
        const handLabel = colorize("Hand:", labelColor);
        const boardLabel = colorize("Board:", labelColor);
        return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}→ ${formatHandResult(handResult, colors)}`;
    },
    compact: (data, colors) => {
        // Same as balanced for now
        return pokerStyles.balanced(data, colors);
    },
    playful: (data, colors) => {
        // Same as balanced for now
        return pokerStyles.balanced(data, colors);
    },
    "compact-verbose": (data, colors) => {
        const { holeCards, boardCards, handResult } = data;
        const participatingSet = new Set(handResult?.participatingIndices || []);
        const handStr = holeCards
            .map((hc, idx) => formatCardCompact(hc, participatingSet.has(idx)))
            .join("");
        const boardStr = boardCards
            .map((bc, idx) => formatCardCompact(bc, participatingSet.has(idx + 2)))
            .join("");
        const abbreviation = getHandAbbreviation(handResult);
        const result = `${handStr}| ${boardStr}→ ${abbreviation}`;
        if (!colors)
            return result;
        return colorize(result, colors.result);
    },
    emoji: (data, colors) => {
        const { holeCards, boardCards, handResult } = data;
        const participatingSet = new Set(handResult?.participatingIndices || []);
        const handStr = holeCards
            .map((hc, idx) => formatCardEmojiByParticipation(hc, participatingSet.has(idx)))
            .join("");
        const boardStr = boardCards
            .map((bc, idx) => formatCardEmojiByParticipation(bc, participatingSet.has(idx + 2)))
            .join("");
        const labelColor = colors?.participating ?? lightGray;
        const handLabel = colorize("Hand:", labelColor);
        const boardLabel = colorize("Board:", labelColor);
        return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}→ ${formatHandResult(handResult, colors)}`;
    },
};
//# sourceMappingURL=styles.js.map