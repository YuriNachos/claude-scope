/**
 * Compact style renderer for ContextWidget
 *
 * Output format: `71%`
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ContextRenderData } from "./types.js";

export class ContextCompactRenderer extends BaseStyleRenderer<ContextRenderData> {
  render(data: ContextRenderData): string {
    return `${data.percent}%`;
  }
}
