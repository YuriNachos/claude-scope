/**
 * Types for GitTagWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface GitTagRenderData {
  tag: string | null;
}

export type GitTagRenderer = BaseStyleRenderer<GitTagRenderData>;
