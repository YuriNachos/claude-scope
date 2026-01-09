/**
 * Theme creation helpers
 *
 * Utility functions to help create theme color objects from raw RGB values.
 * These helpers derive semantic and base colors from widget-specific colors.
 */
import type { IBaseColors, ISemanticColors, IThemeColors } from "./types.js";
/**
 * Create ANSI RGB color code (24-bit true color)
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape code for RGB color
 * @example rgb(136, 192, 208) // "\x1b[38;2;136;192;208m"
 */
export declare function rgb(r: number, g: number, b: number): string;
/**
 * Create base colors from widget colors
 * Derives text, muted, border, and accent from existing widget colors
 */
export declare function createBaseColors(params: {
    modelColor: string;
    durationColor: string;
    accentColor: string;
}): IBaseColors;
/**
 * Create semantic colors from widget colors
 * Derives success, warning, error, info from context and branch colors
 */
export declare function createSemanticColors(params: {
    contextLow: string;
    contextMedium: string;
    contextHigh: string;
    branchColor: string;
}): ISemanticColors;
/**
 * Create theme colors from raw RGB values
 * This is the main helper for creating complete theme color objects
 */
export declare function createThemeColors(params: {
    branch: string;
    changes: string;
    contextLow: string;
    contextMedium: string;
    contextHigh: string;
    linesAdded: string;
    linesRemoved: string;
    cost: string;
    model: string;
    duration: string;
    accent: string;
}): IThemeColors;
//# sourceMappingURL=helpers.d.ts.map