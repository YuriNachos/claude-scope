/**
 * Verbose style renderer for LinesWidget
 * Output: "+142 added, -27 removed" (with colors)
 */

import { colorize } from "../../../ui/utils/formatters.js";
import type { ILinesColors } from "../../../ui/theme/types.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { LinesRenderData } from "./types.js";

export class LinesVerboseRenderer extends BaseStyleRenderer<LinesRenderData> {
  constructor(private colors: ILinesColors) {
    super();
  }

  render(data: LinesRenderData): string {
    const parts: string[] = [];
    if (data.added > 0) {
      parts.push(colorize(`+${data.added} added`, this.colors.added));
    }
    if (data.removed > 0) {
      parts.push(colorize(`-${data.removed} removed`, this.colors.removed));
    }
    return parts.join(", ");
  }
}
