/**
 * Types for CostWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface CostRenderData {
  costUsd: number;
}

export type CostRenderer = BaseStyleRenderer<CostRenderData>;
