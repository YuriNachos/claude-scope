/**
 * Formatter utilities for displaying data in human-readable formats
 */
import { TIME, COST_THRESHOLDS, CONTEXT_THRESHOLDS, ANSI_COLORS, DEFAULTS } from '#constants.js';
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
export function formatDuration(ms) {
    if (ms <= 0)
        return '0s';
    const seconds = Math.floor(ms / TIME.MS_PER_SECOND);
    const hours = Math.floor(seconds / TIME.SECONDS_PER_HOUR);
    const minutes = Math.floor((seconds % TIME.SECONDS_PER_HOUR) / TIME.SECONDS_PER_MINUTE);
    const secs = seconds % TIME.SECONDS_PER_MINUTE;
    const parts = [];
    if (hours > 0) {
        parts.push(`${hours}h`);
        parts.push(`${minutes}m`);
        parts.push(`${secs}s`);
    }
    else if (minutes > 0) {
        parts.push(`${minutes}m`);
        parts.push(`${secs}s`);
    }
    else {
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
export function formatCostUSD(usd) {
    const absUsd = Math.abs(usd);
    if (usd < 0) {
        // Negative values: 2 decimal places
        return `$${usd.toFixed(2)}`;
    }
    else if (absUsd < COST_THRESHOLDS.SMALL) {
        // 4 decimal places for very small positive values
        return `$${usd.toFixed(4)}`;
    }
    else if (absUsd < COST_THRESHOLDS.LARGE) {
        // 2 decimal places for normal values
        return `$${usd.toFixed(2)}`;
    }
    else {
        // 0 decimal places for large values
        return `$${Math.floor(usd).toFixed(0)}`;
    }
}
/**
 * Create a visual progress bar
 *
 * @param percent - Percentage (0-100)
 * @param width - Bar width in characters (default: DEFAULTS.PROGRESS_BAR_WIDTH)
 * @returns Progress bar string like "████████░░░░░░░░░░░░"
 */
export function progressBar(percent, width = DEFAULTS.PROGRESS_BAR_WIDTH) {
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
export function getContextColor(percent) {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    if (clampedPercent < CONTEXT_THRESHOLDS.LOW_MEDIUM) {
        return ANSI_COLORS.GREEN;
    }
    else if (clampedPercent < CONTEXT_THRESHOLDS.MEDIUM_HIGH) {
        return ANSI_COLORS.YELLOW;
    }
    else {
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
export function colorize(text, color) {
    return `${color}${text}${ANSI_COLORS.RESET}`;
}
//# sourceMappingURL=formatters.js.map