/**
 * Functional style renderers for ContextWidget
 *
 * All rendering logic as pure functions instead of classes.
 * Much more compact than the 8 separate renderer files.
 */

import { progressBar } from "../../ui/utils/style-utils.js";
import type { ContextRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const contextStyles: StyleMap<ContextRenderData> = {
  balanced: (data: ContextRenderData) => {
    const bar = progressBar(data.percent, 10);
    return `[${bar}] ${data.percent}%`;
  },

  compact: (data: ContextRenderData) => {
    return `${data.percent}%`;
  },

  playful: (data: ContextRenderData) => {
    const bar = progressBar(data.percent, 10);
    return `🧠 [${bar}] ${data.percent}%`;
  },

  verbose: (data: ContextRenderData) => {
    const usedFormatted = data.used.toLocaleString();
    const maxFormatted = data.contextWindowSize.toLocaleString();
    return `${usedFormatted} / ${maxFormatted} tokens (${data.percent}%)`;
  },

  symbolic: (data: ContextRenderData) => {
    const filled = Math.round(data.percent / 10);
    const empty = 10 - filled;
    return `${"▮".repeat(filled)}${"▯".repeat(empty)} ${data.percent}%`;
  },

  "compact-verbose": (data: ContextRenderData) => {
    const usedK = Math.floor(data.used / 1000);
    const maxK = Math.floor(data.contextWindowSize / 1000);
    return `${data.percent}% (${usedK}K/${maxK}K)`;
  },

  indicator: (data: ContextRenderData) => {
    return `● ${data.percent}%`;
  },

  fancy: (data: ContextRenderData) => {
    return `⟨${data.percent}%⟩`;
  },
};
