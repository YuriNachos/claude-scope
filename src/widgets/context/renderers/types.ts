/**
 * Type definitions for ContextWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface ContextRenderData {
  /** Number of tokens used */
  used: number;
  /** Total context window size */
  contextWindowSize: number;
  /** Usage percentage (0-100) */
  percent: number;
}

export type ContextRenderer = BaseStyleRenderer<ContextRenderData>;
