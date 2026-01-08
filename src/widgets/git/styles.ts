/**
 * Functional style renderers for GitWidget
 */

import { withLabel, withIndicator, withBrackets } from "../../ui/utils/style-utils.js";
import type { GitRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const gitStyles: StyleMap<GitRenderData> = {
  balanced: (data: GitRenderData) => {
    return data.branch;
  },

  compact: (data: GitRenderData) => {
    return data.branch;
  },

  playful: (data: GitRenderData) => {
    return `🔀 ${data.branch}`;
  },

  verbose: (data: GitRenderData) => {
    return `branch: ${data.branch} (HEAD)`;
  },

  labeled: (data: GitRenderData) => {
    return withLabel("Git", data.branch);
  },

  indicator: (data: GitRenderData) => {
    return withIndicator(data.branch);
  },

  fancy: (data: GitRenderData) => {
    return withBrackets(data.branch);
  },
};
