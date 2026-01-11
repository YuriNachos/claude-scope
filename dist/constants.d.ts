/**
 * Constants used throughout the application
 */
/**
 * Time-related constants
 */
export declare const TIME: {
    /** Milliseconds per second */
    readonly MS_PER_SECOND: 1000;
    /** Seconds per minute */
    readonly SECONDS_PER_MINUTE: 60;
    /** Seconds per hour */
    readonly SECONDS_PER_HOUR: 3600;
};
/**
 * Context usage color thresholds (percentages)
 */
export declare const CONTEXT_THRESHOLDS: {
    /** Below this: green (low usage) */
    readonly LOW_MEDIUM: 50;
    /** Below this: yellow (medium usage), above: red (high usage) */
    readonly MEDIUM_HIGH: 80;
};
/**
 * Default values
 */
export declare const DEFAULTS: {
    /** Default separator between widgets */
    readonly SEPARATOR: " ";
    /** Default width for progress bars in characters */
    readonly PROGRESS_BAR_WIDTH: 20;
};
/**
 * ANSI color codes
 */
export declare const ANSI_COLORS: {
    /** Green color */
    readonly GREEN: "\u001B[32m";
    /** Yellow color */
    readonly YELLOW: "\u001B[33m";
    /** Red color */
    readonly RED: "\u001B[31m";
    /** Reset color */
    readonly RESET: "\u001B[0m";
};
/**
 * Demo data constants for quick-config preview
 * Realistic values for testing widget rendering
 */
export declare const DEMO_DATA: {
    /** Demo session cost in USD */
    readonly COST_USD: 0.42;
    /** Demo session duration in milliseconds (~1h 1m 5s) */
    readonly DURATION_MS: 3665000;
    /** Demo API duration in milliseconds (~50m) */
    readonly API_DURATION_MS: 3000000;
    /** Demo lines added */
    readonly LINES_ADDED: 142;
    /** Demo lines removed */
    readonly LINES_REMOVED: 27;
    /** Demo context window size in tokens */
    readonly CONTEXT_WINDOW_SIZE: 200000;
    /** Demo total input tokens */
    readonly TOTAL_INPUT_TOKENS: 185000;
    /** Demo total output tokens */
    readonly TOTAL_OUTPUT_TOKENS: 50000;
    /** Demo current input tokens */
    readonly CURRENT_INPUT_TOKENS: 80000;
    /** Demo current output tokens */
    readonly CURRENT_OUTPUT_TOKENS: 30000;
    /** Demo cache creation tokens */
    readonly CACHE_CREATION_TOKENS: 1000;
    /** Demo cache read tokens */
    readonly CACHE_READ_TOKENS: 15000;
};
export declare const DEFAULT_PROGRESS_BAR_WIDTH: 20;
//# sourceMappingURL=constants.d.ts.map