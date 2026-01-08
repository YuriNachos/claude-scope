/**
 * Balanced style renderer for PokerWidget
 * Output: "Hand: (K♠) A♠ | Board: 2♠ 3♠ 4♠ 5♠ 6♠ → Straight Flush! 🃏"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { bold, gray, lightGray, red, reset } from "../../../ui/utils/colors.js";
import { colorize } from "../../../ui/utils/formatters.js";
import { formatCard, isRedSuit } from "../../poker/types.js";
export class PokerBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        const { holeCards, boardCards, handResult } = data;
        const participatingSet = new Set(handResult?.participatingIndices || []);
        const handStr = holeCards
            .map((hc, idx) => this.formatCardByParticipation(hc, participatingSet.has(idx)))
            .join("");
        const boardStr = boardCards
            .map((bc, idx) => this.formatCardByParticipation(bc, participatingSet.has(idx + 2)))
            .join("");
        const handLabel = colorize("Hand:", lightGray);
        const boardLabel = colorize("Board:", lightGray);
        return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}→ ${this.formatHandResult(handResult)}`;
    }
    formatCardByParticipation(cardData, isParticipating) {
        const color = isRedSuit(cardData.card.suit) ? red : gray;
        const cardText = formatCard(cardData.card);
        if (isParticipating) {
            return `${color}${bold}(${cardText})${reset} `;
        }
        else {
            return `${color}${cardText}${reset} `;
        }
    }
    formatHandResult(handResult) {
        if (!handResult) {
            return "—";
        }
        const playerParticipates = handResult.participatingIndices.some((idx) => idx < 2);
        if (!playerParticipates) {
            return `Nothing 🃏`;
        }
        else {
            return `${handResult.name}! ${handResult.emoji}`;
        }
    }
}
//# sourceMappingURL=balanced.js.map