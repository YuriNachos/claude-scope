/**
 * Fancy style renderer for LinesWidget
 * Output: "⟨+142|-27⟩" (with colors)
 */

import { colorize } from "../../../ui/utils/formatters.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
import type { ILinesColors } from "../../../ui/theme/types.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { LinesRenderData } from "./types.js";

export class LinesFancyRenderer extends BaseStyleRenderer<LinesRenderData> {
  constructor(private colors: ILinesColors) {
    super();
  }

  render(data: LinesRenderData): string {
    const addedStr = colorize(`+${data.added}`, this.colors.added);
    const removedStr = colorize(`-${data.removed}`, this.colors.removed);
    const lines = `${addedStr}|${removedStr}`;
    return withAngleBrackets(lines);
  }
}
