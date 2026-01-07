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
    deck = null;
    holeCards = [];
    boardCards = [];
    handResult = '';
    constructor() {
        super();
    }
    /**
     * Generate new poker hand on each update
     */
    async update(data) {
        await super.update(data);
        // Create new shuffled deck
        this.deck = new Deck();
        // Deal 2 hole cards
        const hole = [
            this.deck.deal(),
            this.deck.deal()
        ];
        // Deal 5 community cards
        const board = [
            this.deck.deal(),
            this.deck.deal(),
            this.deck.deal(),
            this.deck.deal(),
            this.deck.deal()
        ];
        // Evaluate hand
        const result = evaluateHand(hole, board);
        // Format cards
        this.holeCards = hole.map(card => this.formatCardColor(card));
        this.boardCards = board.map(card => this.formatCardColor(card));
        this.handResult = `${result.name}! ${result.emoji}`;
    }
    /**
     * Format card with appropriate color (red for ♥♦, gray for ♠♣)
     */
    formatCardColor(card) {
        const color = isRedSuit(card.suit) ? red : gray;
        return colorize(`[${formatCard(card)}]`, color);
    }
    renderWithData(_data, _context) {
        const handStr = this.holeCards.join(' ');
        const boardStr = this.boardCards.join(' ');
        return `Hand: ${handStr} | Board: ${boardStr} → ${this.handResult}`;
    }
}
//# sourceMappingURL=poker-widget.js.map