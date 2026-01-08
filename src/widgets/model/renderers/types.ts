/**
 * Types for ModelWidget style renderers
 */

import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface ModelRenderData {
  displayName: string;
  id: string;
}

export type ModelRenderer = BaseStyleRenderer<ModelRenderData>;
