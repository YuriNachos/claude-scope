/**
 * Compact style renderer for ModelWidget
 * Output: "Opus 4.5" (removes "Claude " prefix)
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ModelRenderData } from "./types.js";

export class ModelCompactRenderer extends BaseStyleRenderer<ModelRenderData> {
  render(data: ModelRenderData): string {
    // Remove "Claude " prefix if present
    return data.displayName.replace(/^Claude /, "");
  }
}
