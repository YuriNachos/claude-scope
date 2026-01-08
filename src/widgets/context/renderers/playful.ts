/**
 * Playful style renderer for ContextWidget
 *
 * Output format: `🧠 [████░░░] 71%`
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { progressBar } from "../../../ui/utils/style-utils.js";
import type { ContextRenderData } from "./types.js";

export class ContextPlayfulRenderer extends BaseStyleRenderer<ContextRenderData> {
  render(data: ContextRenderData): string {
    const bar = progressBar(data.percent, 10);
    return `🧠 [${bar}] ${data.percent}%`;
  }
}
