/**
 * Types for GitChangesWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface GitChangesRenderData {
  insertions: number;
  deletions: number;
}

export type GitChangesRenderer = BaseStyleRenderer<GitChangesRenderData>;
