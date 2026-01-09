/**
 * Formatter utilities for displaying data in human-readable formats
 */
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
export declare function formatDuration(ms: number): string;
/**
 * Format cost in USD with 2 decimal places
 *
 * Always formats with 2 decimal places for consistency.
 *
 * @param usd - Cost in USD
 * @returns Formatted cost string with $ prefix
 */
export declare function formatCostUSD(usd: number): string;
/**
 * Create a visual progress bar
 *
 * @param percent - Percentage (0-100)
 * @param width - Bar width in characters (default: DEFAULTS.PROGRESS_BAR_WIDTH)
 * @returns Progress bar string like "████████░░░░░░░░░░░░"
 */
export declare function progressBar(percent: number, width?: number): string;
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
export declare function getContextColor(percent: number): string;
/**
 * Colorize text with ANSI color code
 *
 * @param text - Text to colorize
 * @param color - ANSI color code
 * @returns Colorized text with reset code
 */
export declare function colorize(text: string, color: string): string;
/**
 * Format number with K suffix for thousands
 *
 * Examples:
 * - 500 -> "500"
 * - 1500 -> "1.5k"
 * - 10000 -> "10k"
 * - 10500 -> "11k" (rounded)
 * - 100000 -> "100k"
 * - -1500 -> "-1.5k"
 *
 * Shows 1 decimal place for values < 10k, rounds to whole numbers for >= 10k.
 * Handles negative numbers correctly.
 *
 * @param n - Number to format
 * @returns Formatted string with K suffix (e.g., "1.5k", "10k")
 */
export declare function formatK(n: number): string;
//# sourceMappingURL=formatters.d.ts.map