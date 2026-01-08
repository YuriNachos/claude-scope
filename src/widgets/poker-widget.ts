/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */

import type { StyleRendererFn } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { createStyleSetter } from "../utils/create-style-setter.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { Deck } from "./poker/deck.js";
import { evaluateHand } from "./poker/hand-evaluator.js";
import { type Card, formatCard, isRedSuit } from "./poker/types.js";
import { pokerStyles } from "./poker/styles.js";
import type { PokerCardData, PokerRenderData } from "./poker/widget-types.js";
import { DEFAULT_WIDGET_STYLE } from "../core/style-types.js";

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
  private styleFn: StyleRendererFn<PokerRenderData> = pokerStyles.balanced!;

  setStyle = createStyleSetter(pokerStyles, { value: this.styleFn }, DEFAULT_WIDGET_STYLE);

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
    const color = isRedSuit(card.suit) ? "red" : "gray";
    // This is just for internal storage, actual formatting happens in styles
    return formatCard(card);
  }

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    const holeCardsData: PokerCardData[] = this.holeCards.map((hc, idx) => ({
      card: hc.card,
      isParticipating: (this.handResult?.participatingIndices || []).includes(idx),
    }));

    const boardCardsData: PokerCardData[] = this.boardCards.map((bc, idx) => ({
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

    const renderData: PokerRenderData = {
      holeCards: holeCardsData,
      boardCards: boardCardsData,
      handResult,
    };

    return this.styleFn(renderData);
  }

  private getHandName(text: string): string {
    const match = text.match(/^([^!]+)/);
    return match ? match[1].trim() : "Nothing";
  }

  private getHandEmoji(text: string): string {
    const match = text.match(/([🃏♠️♥️♦️♣️🎉✨🌟])/);
    return match ? match[1] : "🃏";
  }
}
