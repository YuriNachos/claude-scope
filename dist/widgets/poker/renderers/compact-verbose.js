/**
 * Compact-Verbose style renderer for PokerWidget
 * Output: "(K♠)A♠ | 2♠3♠4♠5♠6♠ → SF (Straight Flush)"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { bold, gray, red, reset } from "../../../ui/utils/colors.js";
import { isRedSuit } from "../../poker/types.js";
const HAND_ABBREVIATIONS = {
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
export class PokerCompactVerboseRenderer extends BaseStyleRenderer {
    render(data) {
        const { holeCards, boardCards, handResult } = data;
        const participatingSet = new Set(handResult?.participatingIndices || []);
        const handStr = holeCards
            .map((hc, idx) => this.formatCardCompact(hc, participatingSet.has(idx)))
            .join("");
        const boardStr = boardCards
            .map((bc, idx) => this.formatCardCompact(bc, participatingSet.has(idx + 2)))
            .join("");
        const abbreviation = this.getHandAbbreviation(handResult);
        return `${handStr}| ${boardStr}→ ${abbreviation}`;
    }
    formatCardCompact(cardData, isParticipating) {
        const color = isRedSuit(cardData.card.suit) ? red : gray;
        const cardText = this.formatCardText(cardData.card);
        if (isParticipating) {
            return `${color}${bold}(${cardText})${reset}`;
        }
        else {
            return `${color}${cardText}${reset}`;
        }
    }
    formatCardText(card) {
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
    getHandAbbreviation(handResult) {
        if (!handResult) {
            return "— (—)";
        }
        const abbreviation = HAND_ABBREVIATIONS[handResult.name] ?? "—";
        return `${abbreviation} (${handResult.name})`;
    }
}
//# sourceMappingURL=compact-verbose.js.map