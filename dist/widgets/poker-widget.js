/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { Deck } from './poker/deck.js';
import { evaluateHand } from './poker/hand-evaluator.js';
import { formatCard, isRedSuit } from './poker/types.js';
import { colorize } from '../ui/utils/formatters.js';
import { gray, red } from '../ui/utils/colors.js';
export class PokerWidget extends StdinDataWidget {
    id = 'poker';
    metadata = createWidgetMetadata('Poker', 'Displays random Texas Hold\'em hands for entertainment', '1.0.0', 'claude-scope', 2 // Third line (0-indexed)
    );
    holeCards = [];
    boardCards = [];
    handResult = null;
    constructor() {
        super();
    }
    /**
     * Generate new poker hand on each update
     */
    async update(data) {
        await super.update(data);
        const deck = new Deck();
        const hole = [deck.deal(), deck.deal()];
        const board = [deck.deal(), deck.deal(), deck.deal(), deck.deal(), deck.deal()];
        const result = evaluateHand(hole, board);
        // Store cards with formatted versions
        this.holeCards = hole.map(card => ({
            card,
            formatted: this.formatCardColor(card)
        }));
        this.boardCards = board.map(card => ({
            card,
            formatted: this.formatCardColor(card)
        }));
        // Check if player participates (indices 0 or 1 in participatingCards)
        const playerParticipates = result.participatingCards.some(idx => idx < 2);
        if (!playerParticipates) {
            this.handResult = {
                text: `Nothing 🃏`,
                participatingIndices: result.participatingCards
            };
        }
        else {
            this.handResult = {
                text: `${result.name}! ${result.emoji}`,
                participatingIndices: result.participatingCards
            };
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
     * Participating cards: [K♠] (with brackets)
     * Non-participating cards:  K♠  (spaces instead of brackets)
     */
    formatCardByParticipation(cardData, isParticipating) {
        if (isParticipating) {
            return cardData.formatted; // [K♠]
        }
        else {
            // Extract card text from brackets and wrap with spaces
            const inner = cardData.formatted.match(/\[(.+)\]/)?.[1] || cardData.formatted;
            // Preserve color codes if present
            const colorMatch = cardData.formatted.match(/^(\x1b\[\d+m)/);
            const color = colorMatch ? colorMatch[1] : '';
            const reset = cardData.formatted.match(/\x1b\[0m$/) ? '\x1b[0m' : '';
            return ` ${color}${inner}${reset} `;
        }
    }
    renderWithData(_data, _context) {
        const participatingSet = new Set(this.handResult?.participatingIndices || []);
        const handStr = this.holeCards
            .map((hc, idx) => this.formatCardByParticipation(hc, participatingSet.has(idx)))
            .join('');
        const boardStr = this.boardCards
            .map((bc, idx) => this.formatCardByParticipation(bc, participatingSet.has(idx + 2)))
            .join('');
        const handLabel = colorize('Hand:', gray);
        const boardLabel = colorize('Board:', gray);
        return `${handLabel} ${handStr} | ${boardLabel} ${boardStr} → ${this.handResult?.text}`;
    }
}
//# sourceMappingURL=poker-widget.js.map