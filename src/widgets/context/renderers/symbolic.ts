/**
 * Symbolic style renderer for ContextWidget
 *
 * Output format: `▮▮▮▮▯ 71%`
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ContextRenderData } from "./types.js";

export class ContextSymbolicRenderer extends BaseStyleRenderer<ContextRenderData> {
  render(data: ContextRenderData): string {
    const filled = Math.round((data.percent / 100) * 5);
    const empty = 5 - filled;
    const bar = "▮".repeat(filled) + "▯".repeat(empty);
    return `${bar} ${data.percent}%`;
  }
}
