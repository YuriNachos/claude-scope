/**
 * Compact-Verbose style renderer for ContextWidget
 *
 * Output format: `71% (142K/200K)`
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { formatTokens } from "../../../ui/utils/style-utils.js";
import type { ContextRenderData } from "./types.js";

export class ContextCompactVerboseRenderer extends BaseStyleRenderer<ContextRenderData> {
  render(data: ContextRenderData): string {
    const usedK = formatTokens(data.used);
    const maxK = formatTokens(data.contextWindowSize);
    return `${data.percent}% (${usedK}/${maxK})`;
  }
}
