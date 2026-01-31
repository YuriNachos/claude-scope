/**
 * Style utility functions for common display patterns
 *
 * These functions provide reusable formatting patterns used across
 * different widget style renderers. They help avoid code duplication
 * and ensure consistent formatting.
 */

/**
 * Add a label prefix to a value
 *
 * @param prefix - The label prefix (e.g., "Model", "Cost")
 * @param value - The value to label
 * @returns Formatted string with label prefix
 *
 * @example
 * withLabel("Model", "Opus 4.5") // "Model: Opus 4.5"
 */
export function withLabel(prefix: string, value: string): string {
  if (prefix === "") return value;
  return `${prefix}: ${value}`;
}

/**
 * Add a status indicator to a value
 *
 * @param value - The value to indicate
 * @returns Formatted string with bullet indicator
 *
 * @example
 * withIndicator("Opus 4.5") // "● Opus 4.5"
 */
export function withIndicator(value: string): string {
  return `● ${value}`;
}

/**
 * Format a number as token count with K suffix
 *
 * @param n - The number to format
 * @returns Formatted string with K suffix for thousands
 *
 * @example
 * formatTokens(142847) // "142K"
 * formatTokens(999) // "999"
 */
export function formatTokens(n: number): string {
  if (n < 1000) return n.toString();
  return `${Math.floor(n / 1000)}K`;
}

/**
 * Create a progress bar string
 *
 * @param percent - Percentage (0-100), will be clamped
 * @param width - Width of the bar in characters (default 10)
 * @returns Progress bar string with █ (filled) and ░ (empty)
 *
 * @example
 * progressBar(71, 10) // "███████░░░"
 * progressBar(50) // "█████░░░░░" (default width 10)
 */
export function progressBar(percent: number, width = 10): string {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
