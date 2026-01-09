/**
 * Types for PokerWidget style renderers
 */

import type { Card } from "./types.js";

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
