/**
 * Compact style renderer for LinesWidget
 * Output: "+142-27" (with colors: + in green, - in red)
 */

import { colorize } from "../../../ui/utils/formatters.js";
import type { ILinesColors } from "../../../ui/theme/types.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { LinesRenderData } from "./types.js";

export class LinesCompactRenderer extends BaseStyleRenderer<LinesRenderData> {
  constructor(private colors: ILinesColors) {
    super();
  }

  render(data: LinesRenderData): string {
    const addedStr = colorize(`+${data.added}`, this.colors.added);
    const removedStr = colorize(`-${data.removed}`, this.colors.removed);
    return `${addedStr}${removedStr}`;
  }
}
