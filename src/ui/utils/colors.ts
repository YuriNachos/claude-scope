/**
 * ANSI color utilities for terminal output
 *
 * Provides ANSI escape codes for colors and text styling in terminal output.
 * These codes work in most modern terminal emulators.
 */

/**
 * Reset all styles and colors
 */
export const reset = "\x1b[0m";

/**
 * Foreground colors (30-37, 90 for bright/bold variants)
 */
export const red = "\x1b[31m";
export const green = "\x1b[32m";
export const yellow = "\x1b[33m";
export const blue = "\x1b[34m";
export const magenta = "\x1b[35m";
export const cyan = "\x1b[36m";
export const white = "\x1b[37m";
export const gray = "\x1b[90m";
export const lightGray = "\x1b[37m"; // Light gray for labels

/**
 * Background colors (40-47)
 */
export const bgRed = "\x1b[41m";
export const bgGreen = "\x1b[42m";
export const bgYellow = "\x1b[43m";
export const bgBlue = "\x1b[44m";

/**
 * Text styles
 */
export const bold = "\x1b[1m";
export const dim = "\x1b[2m";
export const italic = "\x1b[3m";
export const underline = "\x1b[4m";

/**
 * Context usage colors
 * Used for context progress bar based on usage percentage
 */
export const contextColors = {
  low: green, // <50% usage
  medium: yellow, // 50-79% usage
  high: red, // >=80% usage
} as const;

/**
 * Wrap text in ANSI color
 * @param text - Text to colorize
 * @param color - ANSI color code
 * @returns Colorized text with reset code
 */
export function colorize(text: string, color: string): string {
  return `${color}${text}${reset}`;
}

/**
 * Create ANSI RGB color code (24-bit true color)
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape code for RGB color
 * @example rgb(136, 192, 208) // "\x1b[38;2;136;192;208m"
 */
export function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}
