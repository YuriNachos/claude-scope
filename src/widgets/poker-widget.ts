/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */

import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { bold, gray, lightGray, red, reset } from "../ui/utils/colors.js";
import { colorize } from "../ui/utils/formatters.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { Deck } from "./poker/deck.js";
import { evaluateHand } from "./poker/hand-evaluator.js";
import { type Card, formatCard, isRedSuit } from "./poker/types.js";

export class PokerWidget extends StdinDataWidget {
  readonly id = "poker";
  readonly metadata = createWidgetMetadata(
    "Poker",
    "Displays random Texas Hold'em hands for entertainment",
    "1.0.0",
    "claude-scope",
    2 // Third line (0-indexed)
  );

  private holeCards: { card: Card; formatted: string }[] = [];
  private boardCards: { card: Card; formatted: string }[] = [];
  private handResult: { text: string; participatingIndices: number[] } | null = null;
  private lastUpdateTimestamp = 0;
  private readonly THROTTLE_MS = 5000; // 5 seconds

  /**
   * Generate new poker hand on each update
   */
  async update(data: StdinData): Promise<void> {
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
    } else {
      this.handResult = {
        text: `${result.name}! ${result.emoji}`,
        participatingIndices: result.participatingCards,
      };
    }

    this.lastUpdateTimestamp = now;
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
   * Participating cards: (K♠) with color + BOLD
   * Non-participating cards: K♠ with color, no brackets
   */
  private formatCardByParticipation(
    cardData: { card: Card; formatted: string },
    isParticipating: boolean
  ): string {
    // Get the card color based on suit (red for ♥♦, gray for ♠♣)
    const color = isRedSuit(cardData.card.suit) ? red : gray;
    const cardText = formatCard(cardData.card); // "K♠"

    if (isParticipating) {
      // Participating: (K♠) with color + BOLD, followed by space
      return `${color}${bold}(${cardText})${reset} `;
    } else {
      // Non-participating: K♠ with color, no brackets, with space padding
      return `${color}${cardText}${reset} `;
    }
  }

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    const participatingSet = new Set(this.handResult?.participatingIndices || []);

    const handStr = this.holeCards
      .map((hc, idx) => this.formatCardByParticipation(hc, participatingSet.has(idx)))
      .join("");

    const boardStr = this.boardCards
      .map((bc, idx) => this.formatCardByParticipation(bc, participatingSet.has(idx + 2)))
      .join("");

    const handLabel = colorize("Hand:", lightGray);
    const boardLabel = colorize("Board:", lightGray);

    return `${handLabel} ${handStr} | ${boardLabel} ${boardStr} → ${this.handResult?.text}`;
  }
}
