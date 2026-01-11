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
    SEPARATOR: " ",
    /** Default width for progress bars in characters */
    PROGRESS_BAR_WIDTH: 20,
};
/**
 * ANSI color codes
 */
export const ANSI_COLORS = {
    /** Green color */
    GREEN: "\x1b[32m",
    /** Yellow color */
    YELLOW: "\x1b[33m",
    /** Red color */
    RED: "\x1b[31m",
    /** Reset color */
    RESET: "\x1b[0m",
};
/**
 * Demo data constants for quick-config preview
 * Realistic values for testing widget rendering
 */
export const DEMO_DATA = {
    /** Demo session cost in USD */
    COST_USD: 0.42,
    /** Demo session duration in milliseconds (~1h 1m 5s) */
    DURATION_MS: 3665000,
    /** Demo API duration in milliseconds (~50m) */
    API_DURATION_MS: 3000000,
    /** Demo lines added */
    LINES_ADDED: 142,
    /** Demo lines removed */
    LINES_REMOVED: 27,
    /** Demo context window size in tokens */
    CONTEXT_WINDOW_SIZE: 200000,
    /** Demo total input tokens */
    TOTAL_INPUT_TOKENS: 185000,
    /** Demo total output tokens */
    TOTAL_OUTPUT_TOKENS: 50000,
    /** Demo current input tokens */
    CURRENT_INPUT_TOKENS: 150000,
    /** Demo current output tokens */
    CURRENT_OUTPUT_TOKENS: 50000,
    /** Demo cache creation tokens */
    CACHE_CREATION_TOKENS: 5000,
    /** Demo cache read tokens */
    CACHE_READ_TOKENS: 35000,
};
// Re-export for backward compatibility
export const DEFAULT_PROGRESS_BAR_WIDTH = DEFAULTS.PROGRESS_BAR_WIDTH;
//# sourceMappingURL=constants.js.map