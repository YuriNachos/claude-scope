/**
 * Types for PokerWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { type Card } from "../../poker/types.js";

export interface PokerCardData {
  card: Card;
  isParticipating: boolean;
}

export interface PokerRenderData {
  holeCards: PokerCardData[];
  boardCards: PokerCardData[];
  handResult: {
    name: string;
    emoji: string;
    participatingIndices: number[];
  } | null;
}

export type PokerRenderer = BaseStyleRenderer<PokerRenderData>;
