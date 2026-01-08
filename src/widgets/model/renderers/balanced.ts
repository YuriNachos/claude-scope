/**
 * Balanced style renderer for ModelWidget
 * Output: "Claude Opus 4.5"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ModelRenderData } from "./types.js";

export class ModelBalancedRenderer extends BaseStyleRenderer<ModelRenderData> {
  render(data: ModelRenderData): string {
    return data.displayName;
  }
}
