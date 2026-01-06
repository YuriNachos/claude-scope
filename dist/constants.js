/**
 * Constants used throughout the application
 */
/**
 * Time-related constants
 */
export const TIME = {
    /** Milliseconds per second */
    MS_PER_SECOND: 1000,
    /** Seconds per minute */
    SECONDS_PER_MINUTE: 60,
    /** Seconds per hour */
    SECONDS_PER_HOUR: 3600,
};
/**
 * Cost formatting thresholds
 */
export const COST_THRESHOLDS = {
    /** Below this value, show 4 decimal places ($0.0012) */
    SMALL: 0.01,
    /** Above this value, show no decimal places ($123) */
    LARGE: 100,
};
/**
 * Context usage color thresholds (percentages)
 */
export const CONTEXT_THRESHOLDS = {
    /** Below this: green (low usage) */
    LOW_MEDIUM: 50,
    /** Below this: yellow (medium usage), above: red (high usage) */
    MEDIUM_HIGH: 80,
};
/**
 * Default values
 */
export const DEFAULTS = {
    /** Default separator between widgets */
    SEPARATOR: ' ',
    /** Default width for progress bars in characters */
    PROGRESS_BAR_WIDTH: 20,
};
/**
 * ANSI color codes
 */
export const ANSI_COLORS = {
    /** Green color */
    GREEN: '\x1b[32m',
    /** Yellow color */
    YELLOW: '\x1b[33m',
    /** Red color */
    RED: '\x1b[31m',
    /** Reset color */
    RESET: '\x1b[0m',
};
// Re-export for backward compatibility
export const DEFAULT_PROGRESS_BAR_WIDTH = DEFAULTS.PROGRESS_BAR_WIDTH;
//# sourceMappingURL=constants.js.map