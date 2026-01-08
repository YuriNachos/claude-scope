/**
 * Functional style renderers for GitTagWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IGitColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { GitTagRenderData } from "./types.js";

export const gitTagStyles: StyleMap<GitTagRenderData, IGitColors> = {
  balanced: (data: GitTagRenderData, colors?: IGitColors) => {
    const tag = data.tag || "—";
    if (!colors) return tag;
    return colorize(tag, colors.branch);
  },

  compact: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!data.tag) return "—";
    // Remove "v" prefix if present
    const tag = data.tag.replace(/^v/, "");
    if (!colors) return tag;
    return colorize(tag, colors.branch);
  },

  playful: (data: GitTagRenderData, colors?: IGitColors) => {
    const tag = data.tag || "—";
    if (!colors) return `🏷️ ${tag}`;
    return `🏷️ ${colorize(tag, colors.branch)}`;
  },

  verbose: (data: GitTagRenderData, colors?: IGitColors) => {
    if (!data.tag) return "version: none";
    const tag = `version ${data.tag}`;
    if (!colors) return tag;
    return `version ${colorize(data.tag, colors.branch)}`;
  },

  labeled: (data: GitTagRenderData, colors?: IGitColors) => {
    const tag = data.tag || "none";
    if (!colors) return withLabel("Tag", tag);
    return withLabel("Tag", colorize(tag, colors.branch));
  },

  indicator: (data: GitTagRenderData, colors?: IGitColors) => {
    const tag = data.tag || "—";
    if (!colors) return withIndicator(tag);
    return withIndicator(colorize(tag, colors.branch));
  },
};
