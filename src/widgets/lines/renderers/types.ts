/**
 * Types for LinesWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface LinesRenderData {
  added: number;
  removed: number;
}

export type LinesRenderer = BaseStyleRenderer<LinesRenderData>;
