/**
 * Fancy style renderer for ContextWidget
 *
 * Output format: `⟨71%⟩`
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
import type { ContextRenderData } from "./types.js";

export class ContextFancyRenderer extends BaseStyleRenderer<ContextRenderData> {
  render(data: ContextRenderData): string {
    return withAngleBrackets(`${data.percent}%`);
  }
}
