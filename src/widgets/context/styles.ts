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
    const filled = Math.round((data.percent / 100) * 5);
    const empty = 5 - filled;
    return `${"▮".repeat(filled)}${"▯".repeat(empty)} ${data.percent}%`;
  },

  "compact-verbose": (data: ContextRenderData) => {
    const usedK = data.used >= 1000 ? `${Math.floor(data.used / 1000)}K` : data.used.toString();
    const maxK = data.contextWindowSize >= 1000 ? `${Math.floor(data.contextWindowSize / 1000)}K` : data.contextWindowSize.toString();
    return `${data.percent}% (${usedK}/${maxK})`;
  },

  indicator: (data: ContextRenderData) => {
    return `● ${data.percent}%`;
  },
};
