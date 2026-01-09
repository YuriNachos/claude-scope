/**
 * Functional style renderers for DurationWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IDurationColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { formatDuration } from "../../ui/utils/formatters.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { DurationRenderData } from "./types.js";

export const durationStyles: StyleMap<DurationRenderData, IDurationColors> = {
  balanced: (data: DurationRenderData, colors?: IDurationColors) => {
    const formatted = formatDuration(data.durationMs);
    if (!colors) return formatted;

    // Colorize the value part, keep units muted
    return formatDurationWithColors(data.durationMs, colors);
  },

  compact: (data: DurationRenderData, colors?: IDurationColors) => {
    const totalSeconds = Math.floor(data.durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (!colors) {
      if (hours > 0) {
        return `${hours}h${minutes}m`;
      }
      return `${minutes}m`;
    }

    if (hours > 0) {
      return (
        colorize(`${hours}`, colors.value) +
        colorize("h", colors.unit) +
        colorize(`${minutes}`, colors.value) +
        colorize("m", colors.unit)
      );
    }
    return colorize(`${minutes}`, colors.value) + colorize("m", colors.unit);
  },

  playful: (data: DurationRenderData, colors?: IDurationColors) => {
    const totalSeconds = Math.floor(data.durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (!colors) {
      if (hours > 0) {
        return `⌛ ${hours}h ${minutes}m`;
      }
      return `⌛ ${minutes}m`;
    }

    if (hours > 0) {
      const colored =
        colorize(`${hours}`, colors.value) +
        colorize("h", colors.unit) +
        colorize(` ${minutes}`, colors.value) +
        colorize("m", colors.unit);
      return `⌛ ${colored}`;
    }
    return `⌛ ${colorize(`${minutes}`, colors.value)}${colorize("m", colors.unit)}`;
  },

  technical: (data: DurationRenderData, colors?: IDurationColors) => {
    const value = `${Math.floor(data.durationMs)}ms`;
    if (!colors) return value;

    return colorize(`${Math.floor(data.durationMs)}`, colors.value) + colorize("ms", colors.unit);
  },

  labeled: (data: DurationRenderData, colors?: IDurationColors) => {
    const formatted = formatDuration(data.durationMs);
    if (!colors) return withLabel("Time", formatted);

    const colored = formatDurationWithColors(data.durationMs, colors);
    return withLabel("Time", colored);
  },

  indicator: (data: DurationRenderData, colors?: IDurationColors) => {
    const formatted = formatDuration(data.durationMs);
    if (!colors) return withIndicator(formatted);

    const colored = formatDurationWithColors(data.durationMs, colors);
    return withIndicator(colored);
  },
};

/**
 * Helper to format duration with colors
 * Parses the formatted duration and applies colors to values and units
 * Matches formatDuration behavior: always shows seconds when hours/minutes present
 */
function formatDurationWithColors(ms: number, colors: IDurationColors): string {
  if (ms <= 0) return colorize("0s", colors.value);

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(
      colorize(`${hours}`, colors.value) + colorize("h", colors.unit),
      colorize(`${minutes}`, colors.value) + colorize("m", colors.unit),
      colorize(`${seconds}`, colors.value) + colorize("s", colors.unit)
    );
  } else if (minutes > 0) {
    parts.push(
      colorize(`${minutes}`, colors.value) + colorize("m", colors.unit),
      colorize(`${seconds}`, colors.value) + colorize("s", colors.unit)
    );
  } else {
    parts.push(colorize(`${seconds}`, colors.value) + colorize("s", colors.unit));
  }

  return parts.join(" ");
}
