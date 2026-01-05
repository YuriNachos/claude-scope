/**
 * ANSI color utilities for terminal output
 *
 * Provides ANSI escape codes for colors and text styling in terminal output.
 * These codes work in most modern terminal emulators.
 */

/**
 * Reset all styles and colors
 */
export const reset = '\x1b[0m';

/**
 * Foreground colors (30-37, 90 for bright/bold variants)
 */
export const red = '\x1b[31m';
export const green = '\x1b[32m';
export const yellow = '\x1b[33m';
export const blue = '\x1b[34m';
export const magenta = '\x1b[35m';
export const cyan = '\x1b[36m';
export const white = '\x1b[37m';
export const gray = '\x1b[90m';

/**
 * Background colors (40-47)
 */
export const bgRed = '\x1b[41m';
export const bgGreen = '\x1b[42m';
export const bgYellow = '\x1b[43m';
export const bgBlue = '\x1b[44m';

/**
 * Text styles
 */
export const bold = '\x1b[1m';
export const dim = '\x1b[2m';
export const italic = '\x1b[3m';
export const underline = '\x1b[4m';
