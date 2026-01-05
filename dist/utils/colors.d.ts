/**
 * ANSI color utilities for terminal output
 *
 * Provides ANSI escape codes for colors and text styling in terminal output.
 * These codes work in most modern terminal emulators.
 */
/**
 * Reset all styles and colors
 */
export declare const reset = "\u001B[0m";
/**
 * Foreground colors (30-37, 90 for bright/bold variants)
 */
export declare const red = "\u001B[31m";
export declare const green = "\u001B[32m";
export declare const yellow = "\u001B[33m";
export declare const blue = "\u001B[34m";
export declare const magenta = "\u001B[35m";
export declare const cyan = "\u001B[36m";
export declare const white = "\u001B[37m";
export declare const gray = "\u001B[90m";
/**
 * Background colors (40-47)
 */
export declare const bgRed = "\u001B[41m";
export declare const bgGreen = "\u001B[42m";
export declare const bgYellow = "\u001B[43m";
export declare const bgBlue = "\u001B[44m";
/**
 * Text styles
 */
export declare const bold = "\u001B[1m";
export declare const dim = "\u001B[2m";
export declare const italic = "\u001B[3m";
export declare const underline = "\u001B[4m";
//# sourceMappingURL=colors.d.ts.map