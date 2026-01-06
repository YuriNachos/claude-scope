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
 * Cost formatting thresholds
 */
export declare const COST_THRESHOLDS: {
    /** Below this value, show 4 decimal places ($0.0012) */
    readonly SMALL: 0.01;
    /** Above this value, show no decimal places ($123) */
    readonly LARGE: 100;
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
export declare const DEFAULT_PROGRESS_BAR_WIDTH: 20;
//# sourceMappingURL=constants.d.ts.map