/**
 * Functional style renderers for GitTagWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IGitColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { GitTagRenderData } from "./types.js";

// Note: tag is guaranteed to be non-null (widget returns null when no tag exists)
export const gitTagStyles: StyleMap<GitTagRenderData, IGitColors> = {
  balanced: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!colors) return data.tag!;
    return colorize(data.tag!, colors.branch);
  },

  compact: (data: GitTagRenderData, colors?: IGitColors) => {
    // Remove "v" prefix if present
    const tag = data.tag!.replace(/^v/, "");
    if (!colors) return tag;
    return colorize(tag, colors.branch);
  },

  playful: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!colors) return `🏷️ ${data.tag}`;
    return `🏷️ ${colorize(data.tag!, colors.branch)}`;
  },

  verbose: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!colors) return `version ${data.tag}`;
    return `version ${colorize(data.tag!, colors.branch)}`;
  },

  labeled: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!colors) return withLabel("Tag", data.tag!);
    return withLabel("Tag", colorize(data.tag!, colors.branch));
  },

  indicator: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!colors) return withIndicator(data.tag!);
    return withIndicator(colorize(data.tag!, colors.branch));
  },
};
