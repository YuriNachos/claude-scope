/**
 * Functional style renderers for LinesWidget
 *
 * These style functions accept colors as a parameter to support color customization.
 */

import type { StyleMap } from "../../core/style-types.js";
import type { ILinesColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { LinesRenderData } from "./types.js";

export const linesStyles: StyleMap<LinesRenderData, ILinesColors> = {
  balanced: (data: LinesRenderData, colors?: ILinesColors) => {
    if (!colors) return `+${data.added}/-${data.removed}`;
    const addedStr = colorize(`+${data.added}`, colors.added);
    const removedStr = colorize(`-${data.removed}`, colors.removed);
    return `${addedStr}/${removedStr}`;
  },

  compact: (data: LinesRenderData, colors?: ILinesColors) => {
    if (!colors) return `+${data.added}-${data.removed}`;
    const addedStr = colorize(`+${data.added}`, colors.added);
    const removedStr = colorize(`-${data.removed}`, colors.removed);
    return `${addedStr}${removedStr}`;
  },

  playful: (data: LinesRenderData, colors?: ILinesColors) => {
    if (!colors) return `➕${data.added} ➖${data.removed}`;
    const addedStr = colorize(`➕${data.added}`, colors.added);
    const removedStr = colorize(`➖${data.removed}`, colors.removed);
    return `${addedStr} ${removedStr}`;
  },

  verbose: (data: LinesRenderData, colors?: ILinesColors) => {
    const parts: string[] = [];
    if (data.added > 0) {
      const text = `+${data.added} added`;
      parts.push(colors ? colorize(text, colors.added) : text);
    }
    if (data.removed > 0) {
      const text = `-${data.removed} removed`;
      parts.push(colors ? colorize(text, colors.removed) : text);
    }
    return parts.join(", ");
  },

  labeled: (data: LinesRenderData, colors?: ILinesColors) => {
    const addedStr = colors ? colorize(`+${data.added}`, colors.added) : `+${data.added}`;
    const removedStr = colors ? colorize(`-${data.removed}`, colors.removed) : `-${data.removed}`;
    const lines = `${addedStr}/${removedStr}`;
    return withLabel("Lines", lines);
  },

  indicator: (data: LinesRenderData, colors?: ILinesColors) => {
    const addedStr = colors ? colorize(`+${data.added}`, colors.added) : `+${data.added}`;
    const removedStr = colors ? colorize(`-${data.removed}`, colors.removed) : `-${data.removed}`;
    const lines = `${addedStr}/${removedStr}`;
    return withIndicator(lines);
  },
};
