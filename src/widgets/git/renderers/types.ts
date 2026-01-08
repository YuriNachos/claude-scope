/**
 * Types for GitWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface GitRenderData {
  branch: string;
}

export type GitRenderer = BaseStyleRenderer<GitRenderData>;
