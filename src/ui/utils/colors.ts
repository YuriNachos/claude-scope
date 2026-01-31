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
export const gray = "\x1b[90m";
export const lightGray = "\x1b[37m"; // Light gray for labels

/**
 * Text styles
 */
export const bold = "\x1b[1m";

/**
 * Wrap text in ANSI color
 * @param text - Text to colorize
 * @param color - ANSI color code
 * @returns Colorized text with reset code
 */
export function colorize(text: string, color: string): string {
  return `${color}${text}${reset}`;
}
