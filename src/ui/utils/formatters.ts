/**
 * Formatter utilities for displaying data in human-readable formats
 */

import { ANSI_COLORS, CONTEXT_THRESHOLDS, DEFAULTS, TIME } from "../../constants.js";

/**
 * Format milliseconds to human-readable duration
 *
 * Examples:
 * - 45000 -> "45s"
 * - 60000 -> "1m 0s"
 * - 3600000 -> "1h 0m 0s"
 * - 3665000 -> "1h 1m 5s"
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration string
 */
export function formatDuration(ms: number): string {
  if (ms <= 0) return "0s";

  const seconds = Math.floor(ms / TIME.MS_PER_SECOND);
  const hours = Math.floor(seconds / TIME.SECONDS_PER_HOUR);
  const minutes = Math.floor((seconds % TIME.SECONDS_PER_HOUR) / TIME.SECONDS_PER_MINUTE);
  const secs = seconds % TIME.SECONDS_PER_MINUTE;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
  } else if (minutes > 0) {
    parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
  } else {
    parts.push(`${secs}s`);
  }

  return parts.join(" ");
}

/**
 * Format cost in USD with 2 decimal places
 *
 * Always formats with 2 decimal places for consistency.
 *
 * @param usd - Cost in USD
 * @returns Formatted cost string with $ prefix
 */
export function formatCostUSD(usd: number): string {
  return `$${usd.toFixed(2)}`;
}

/**
 * Create a visual progress bar
 *
 * @param percent - Percentage (0-100)
 * @param width - Bar width in characters (default: DEFAULTS.PROGRESS_BAR_WIDTH)
 * @returns Progress bar string like "████████░░░░░░░░░░░░"
 */
export function progressBar(percent: number, width: number = DEFAULTS.PROGRESS_BAR_WIDTH): string {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clampedPercent / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

/**
 * Get color code for context percentage
 *
 * - <50%: green (low usage)
 * - 50-79%: yellow (medium usage)
 * - >=80%: red (high usage)
 *
 * @param percent - Context usage percentage (0-100)
 * @returns ANSI color code
 */
export function getContextColor(percent: number): string {
  const clampedPercent = Math.max(0, Math.min(100, percent));

  if (clampedPercent < CONTEXT_THRESHOLDS.LOW_MEDIUM) {
    return ANSI_COLORS.GREEN;
  } else if (clampedPercent < CONTEXT_THRESHOLDS.MEDIUM_HIGH) {
    return ANSI_COLORS.YELLOW;
  } else {
    return ANSI_COLORS.RED;
  }
}

/**
 * Colorize text with ANSI color code
 *
 * @param text - Text to colorize
 * @param color - ANSI color code
 * @returns Colorized text with reset code
 */
export function colorize(text: string, color: string): string {
  return `${color}${text}${ANSI_COLORS.RESET}`;
}
