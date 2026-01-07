/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { Deck } from './poker/deck.js';
import { evaluateHand } from './poker/hand-evaluator.js';
import { formatCard, isRedSuit, type Card } from './poker/types.js';
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

  private holeCards: { card: Card; formatted: string }[] = [];
  private boardCards: { card: Card; formatted: string }[] = [];
  private handResult: { text: string; participatingIndices: number[] } | null = null;

  constructor() {
    super();
  }

  /**
   * Generate new poker hand on each update
   */
  async update(data: StdinData): Promise<void> {
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
    } else {
      this.handResult = {
        text: `${result.name}! ${result.emoji}`,
        participatingIndices: result.participatingCards
      };
    }
  }

  /**
   * Format card with appropriate color (red for ♥♦, gray for ♠♣)
   */
  private formatCardColor(card: Card): string {
    const color = isRedSuit(card.suit) ? red : gray;
    return colorize(`[${formatCard(card)}]`, color);
  }

  /**
   * Format card based on participation in best hand
   * Participating cards: [K♠] (with brackets)
   * Non-participating cards:  K♠  (spaces instead of brackets)
   */
  private formatCardByParticipation(
    cardData: { card: Card; formatted: string },
    isParticipating: boolean
  ): string {
    if (isParticipating) {
      return cardData.formatted; // [K♠] with colors
    } else {
      // Use formatCard() directly to get plain text without ANSI codes
      const plainText = formatCard(cardData.card); // Returns "6♣"
      return ` ${plainText} `;
    }
  }

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
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
