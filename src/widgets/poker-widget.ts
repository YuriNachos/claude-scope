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
import type { RenderContext, StdinData } from '../types.js';

export class PokerWidget extends StdinDataWidget {
  readonly id = 'poker';
  readonly metadata = createWidgetMetadata(
    'Poker',
    'Displays random Texas Hold\'em hands for entertainment',
    '1.0.0',
    'claude-scope',
    2  // Third line (0-indexed)
  );

  private deck: Deck | null = null;
  private holeCards: string[] = [];
  private boardCards: string[] = [];
  private handResult = '';

  constructor() {
    super();
  }

  /**
   * Generate new poker hand on each update
   */
  async update(data: StdinData): Promise<void> {
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
  private formatCardColor(card: { rank: string; suit: string }): string {
    const color = isRedSuit(card.suit as any) ? red : gray;
    return colorize(`[${formatCard(card as any)}]`, color);
  }

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    const handStr = this.holeCards.join(' ');
    const boardStr = this.boardCards.join(' ');

    return `Hand: ${handStr} | Board: ${boardStr} → ${this.handResult}`;
  }
}
