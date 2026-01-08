/**
 * Indicator style renderer for ContextWidget
 *
 * Output format: `● 71%`
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
import type { ContextRenderData } from "./types.js";

export class ContextIndicatorRenderer extends BaseStyleRenderer<ContextRenderData> {
  render(data: ContextRenderData): string {
    return withIndicator(`${data.percent}%`);
  }
}
