/**
 * Functional style renderers for DurationWidget
 */

import { formatDuration } from "../../ui/utils/formatters.js";
import { withIndicator, withAngleBrackets, withLabel } from "../../ui/utils/style-utils.js";
import type { DurationRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const durationStyles: StyleMap<DurationRenderData> = {
  balanced: (data: DurationRenderData) => {
    return formatDuration(data.durationMs);
  },

  compact: (data: DurationRenderData) => {
    const totalSeconds = Math.floor(data.durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h${minutes}m`;
    }
    return `${minutes}m`;
  },

  playful: (data: DurationRenderData) => {
    const totalSeconds = Math.floor(data.durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `⌛ ${hours}h ${minutes}m`;
    }
    return `⌛ ${minutes}m`;
  },

  technical: (data: DurationRenderData) => {
    return `${Math.floor(data.durationMs)}ms`;
  },

  labeled: (data: DurationRenderData) => {
    return withLabel("Time", formatDuration(data.durationMs));
  },

  indicator: (data: DurationRenderData) => {
    return withIndicator(formatDuration(data.durationMs));
  },

  fancy: (data: DurationRenderData) => {
    return withAngleBrackets(formatDuration(data.durationMs));
  },
};
