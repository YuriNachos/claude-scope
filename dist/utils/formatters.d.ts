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
export declare function formatCostUSD(usd: number): string;
/**
 * Create a visual progress bar
 *
 * @param percent - Percentage (0-100)
 * @param width - Bar width in characters (default: 20)
 * @returns Progress bar string like "████████░░░░░░░░░░░"
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
//# sourceMappingURL=formatters.d.ts.map