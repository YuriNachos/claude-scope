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
export declare const lightGray = "\u001B[37m";
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
/**
 * Context usage colors
 * Used for context progress bar based on usage percentage
 */
export declare const contextColors: {
    readonly low: "\u001B[32m";
    readonly medium: "\u001B[33m";
    readonly high: "\u001B[31m";
};
/**
 * Wrap text in ANSI color
 * @param text - Text to colorize
 * @param color - ANSI color code
 * @returns Colorized text with reset code
 */
export declare function colorize(text: string, color: string): string;
//# sourceMappingURL=colors.d.ts.map