/**
 * Compact-Verbose style renderer for PokerWidget
 * Output: "(K♠)A♠ | 2♠3♠4♠5♠6♠ → SF (Straight Flush)"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { bold, gray, red, reset } from "../../../ui/utils/colors.js";
import { isRedSuit, type Card } from "../../poker/types.js";
import type { PokerCardData, PokerRenderData } from "./types.js";

const HAND_ABBREVIATIONS: Record<string, string> = {
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

export class PokerCompactVerboseRenderer extends BaseStyleRenderer<PokerRenderData> {
  render(data: PokerRenderData): string {
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

  private formatCardCompact(cardData: PokerCardData, isParticipating: boolean): string {
    const color = isRedSuit(cardData.card.suit) ? red : gray;
    const cardText = this.formatCardText(cardData.card);

    if (isParticipating) {
      return `${color}${bold}(${cardText})${reset}`;
    } else {
      return `${color}${cardText}${reset}`;
    }
  }

  private formatCardText(card: Card): string {
    const rankSymbols: Record<string, string> = {
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

  private getHandAbbreviation(
    handResult: PokerRenderData["handResult"]
  ): string {
    if (!handResult) {
      return "— (—)";
    }

    const abbreviation = HAND_ABBREVIATIONS[handResult.name] ?? "—";

    return `${abbreviation} (${handResult.name})`;
  }
}
