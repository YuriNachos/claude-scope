/**
 * Formatter utilities for displaying data in human-readable formats
 */

import { DEFAULT_PROGRESS_BAR_WIDTH } from '../constants.js';

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
  if (ms <= 0) return '0s';

  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

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

  return parts.join(' ');
}

/**
 * Format cost in USD with appropriate precision
 *
 * - Values < $0.01 (positive): 4 decimal places ($0.0012)
 * - Values >= $0.01: 2 decimal places ($1.23)
 * - Values >= $100: 0 decimal places ($123)
 * - Negative values: 2 decimal places ($-1.23)
 *
 * @param usd - Cost in USD
 * @returns Formatted cost string with $ prefix
 */
export function formatCostUSD(usd: number): string {
  const absUsd = Math.abs(usd);

  if (usd < 0) {
    // Negative values: 2 decimal places
    return `$${usd.toFixed(2)}`;
  } else if (absUsd < 0.01) {
    // 4 decimal places for very small positive values
    return `$${usd.toFixed(4)}`;
  } else if (absUsd < 100) {
    // 2 decimal places for normal values
    return `$${usd.toFixed(2)}`;
  } else {
    // 0 decimal places for large values
    return `$${Math.floor(usd).toFixed(0)}`;
  }
}

/**
 * Create a visual progress bar
 *
 * @param percent - Percentage (0-100)
 * @param width - Bar width in characters (default: DEFAULT_PROGRESS_BAR_WIDTH)
 * @returns Progress bar string like "████████░░░░░░░░░░░"
 */
export function progressBar(percent: number, width: number = DEFAULT_PROGRESS_BAR_WIDTH): string {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clampedPercent / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
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

  if (clampedPercent < 50) {
    return '\x1b[32m'; // Green
  } else if (clampedPercent < 80) {
    return '\x1b[33m'; // Yellow
  } else {
    return '\x1b[31m'; // Red
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
  return `${color}${text}\x1b[0m`;
}
