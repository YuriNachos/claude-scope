/**
 * Functional style renderers for LinesWidget
 *
 * These style functions accept colors as a parameter to support color customization.
 */

import { colorize } from "../../ui/utils/formatters.js";
import { withLabel, withIndicator, withAngleBrackets } from "../../ui/utils/style-utils.js";
import type { ILinesColors } from "../../ui/theme/types.js";
import type { LinesRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

/**
 * Create a style map with colors bound to the style functions
 */
export function createLinesStyles(colors: ILinesColors): StyleMap<LinesRenderData> {
  return {
    balanced: (data: LinesRenderData) => {
      const addedStr = colorize(`+${data.added}`, colors.added);
      const removedStr = colorize(`-${data.removed}`, colors.removed);
      return `${addedStr}/${removedStr}`;
    },

    compact: (data: LinesRenderData) => {
      const addedStr = colorize(`+${data.added}`, colors.added);
      const removedStr = colorize(`-${data.removed}`, colors.removed);
      return `${addedStr}${removedStr}`;
    },

    playful: (data: LinesRenderData) => {
      const addedStr = colorize(`➕${data.added}`, colors.added);
      const removedStr = colorize(`➖${data.removed}`, colors.removed);
      return `${addedStr} ${removedStr}`;
    },

    verbose: (data: LinesRenderData) => {
      const parts: string[] = [];
      if (data.added > 0) {
        parts.push(colorize(`+${data.added} added`, colors.added));
      }
      if (data.removed > 0) {
        parts.push(colorize(`-${data.removed} removed`, colors.removed));
      }
      return parts.join(", ");
    },

    labeled: (data: LinesRenderData) => {
      const addedStr = colorize(`+${data.added}`, colors.added);
      const removedStr = colorize(`-${data.removed}`, colors.removed);
      const lines = `${addedStr}/${removedStr}`;
      return withLabel("Lines", lines);
    },

    indicator: (data: LinesRenderData) => {
      const addedStr = colorize(`+${data.added}`, colors.added);
      const removedStr = colorize(`-${data.removed}`, colors.removed);
      const lines = `${addedStr}/${removedStr}`;
      return withIndicator(lines);
    },

    fancy: (data: LinesRenderData) => {
      const addedStr = colorize(`+${data.added}`, colors.added);
      const removedStr = colorize(`-${data.removed}`, colors.removed);
      const lines = `${addedStr}|${removedStr}`;
      return withAngleBrackets(lines);
    },
  };
}
