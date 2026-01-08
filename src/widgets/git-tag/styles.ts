/**
 * Functional style renderers for GitTagWidget
 */

import { withLabel, withIndicator } from "../../ui/utils/style-utils.js";
import type { GitTagRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const gitTagStyles: StyleMap<GitTagRenderData> = {
  balanced: (data: GitTagRenderData) => {
    return data.tag || "—";
  },

  compact: (data: GitTagRenderData) => {
    if (!data.tag) return "—";
    // Remove "v" prefix if present
    return data.tag.replace(/^v/, "");
  },

  playful: (data: GitTagRenderData) => {
    return `🏷️ ${data.tag || "—"}`;
  },

  verbose: (data: GitTagRenderData) => {
    if (!data.tag) return "version: none";
    return `version ${data.tag}`;
  },

  labeled: (data: GitTagRenderData) => {
    return withLabel("Tag", data.tag || "none");
  },

  indicator: (data: GitTagRenderData) => {
    return withIndicator(data.tag || "—");
  },
};
