/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { bold, gray, red, reset } from "../ui/utils/colors.js";
import { colorize } from "../ui/utils/formatters.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { Deck } from "./poker/deck.js";
import { evaluateHand } from "./poker/hand-evaluator.js";
import { formatCard, isRedSuit } from "./poker/types.js";
import { PokerBalancedRenderer } from "./poker/renderers/balanced.js";
import { PokerCompactVerboseRenderer } from "./poker/renderers/compact-verbose.js";
import { DEFAULT_WIDGET_STYLE } from "../core/style-types.js";
export class PokerWidget extends StdinDataWidget {
    id = "poker";
    metadata = createWidgetMetadata("Poker", "Displays random Texas Hold'em hands for entertainment", "1.0.0", "claude-scope", 2 // Third line (0-indexed)
    );
    holeCards = [];
    boardCards = [];
    handResult = null;
    lastUpdateTimestamp = 0;
    THROTTLE_MS = 5000; // 5 seconds
    renderer = new PokerBalancedRenderer();
    /**
     * Generate new poker hand on each update
     */
    async update(data) {
        await super.update(data);
        const now = Date.now();
        // Check if enough time has passed since last update
        if (now - this.lastUpdateTimestamp < this.THROTTLE_MS) {
            // Skip update - keep current hand
            return;
        }
        // Generate new hand
        const deck = new Deck();
        const hole = [deck.deal(), deck.deal()];
        const board = [deck.deal(), deck.deal(), deck.deal(), deck.deal(), deck.deal()];
        const result = evaluateHand(hole, board);
        this.holeCards = hole.map((card) => ({
            card,
            formatted: this.formatCardColor(card),
        }));
        this.boardCards = board.map((card) => ({
            card,
            formatted: this.formatCardColor(card),
        }));
        const playerParticipates = result.participatingCards.some((idx) => idx < 2);
        if (!playerParticipates) {
            this.handResult = {
                text: `Nothing 🃏`,
                participatingIndices: result.participatingCards,
            };
        }
        else {
            this.handResult = {
                text: `${result.name}! ${result.emoji}`,
                participatingIndices: result.participatingCards,
            };
        }
        this.lastUpdateTimestamp = now;
    }
    setStyle(style = DEFAULT_WIDGET_STYLE) {
        switch (style) {
            case "balanced":
            case "compact":
            case "playful":
                this.renderer = new PokerBalancedRenderer();
                break;
            case "compact-verbose":
                this.renderer = new PokerCompactVerboseRenderer();
                break;
            default:
                this.renderer = new PokerBalancedRenderer();
                break;
        }
    }
    /**
     * Format card with appropriate color (red for ♥♦, gray for ♠♣)
     */
    formatCardColor(card) {
        const color = isRedSuit(card.suit) ? red : gray;
        return colorize(`[${formatCard(card)}]`, color);
    }
    /**
     * Format card based on participation in best hand
     * Participating cards: (K♠) with color + BOLD
     * Non-participating cards: K♠ with color, no brackets
     */
    formatCardByParticipation(cardData, isParticipating) {
        // Get the card color based on suit (red for ♥♦, gray for ♠♣)
        const color = isRedSuit(cardData.card.suit) ? red : gray;
        const cardText = formatCard(cardData.card); // "K♠"
        if (isParticipating) {
            // Participating: (K♠) with color + BOLD, followed by space
            return `${color}${bold}(${cardText})${reset} `;
        }
        else {
            // Non-participating: K♠ with color, no brackets, with space padding
            return `${color}${cardText}${reset} `;
        }
    }
    renderWithData(_data, _context) {
        const holeCardsData = this.holeCards.map((hc, idx) => ({
            card: hc.card,
            isParticipating: (this.handResult?.participatingIndices || []).includes(idx),
        }));
        const boardCardsData = this.boardCards.map((bc, idx) => ({
            card: bc.card,
            isParticipating: (this.handResult?.participatingIndices || []).includes(idx + 2),
        }));
        const handResult = this.handResult
            ? {
                name: this.getHandName(this.handResult.text),
                emoji: this.getHandEmoji(this.handResult.text),
                participatingIndices: this.handResult.participatingIndices,
            }
            : null;
        const renderData = {
            holeCards: holeCardsData,
            boardCards: boardCardsData,
            handResult,
        };
        return this.renderer.render(renderData);
    }
    getHandName(text) {
        const match = text.match(/^([^!]+)/);
        return match ? match[1].trim() : "Nothing";
    }
    getHandEmoji(text) {
        const match = text.match(/([🃏♠️♥️♦️♣️🎉✨🌟])/);
        return match ? match[1] : "🃏";
    }
}
//# sourceMappingURL=poker-widget.js.map