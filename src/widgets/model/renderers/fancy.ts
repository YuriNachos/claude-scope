/**
 * Fancy style renderer for ModelWidget
 * Output: "[Opus 4.5]"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ModelRenderData } from "./types.js";

export class ModelFancyRenderer extends BaseStyleRenderer<ModelRenderData> {
  render(data: ModelRenderData): string {
    const shortName = data.displayName.replace(/^Claude /, "");
    return `[${shortName}]`;
  }
}
