/**
 * Catppuccin Mocha theme
 * Soothing pastel theme
 * https://catppuccin.com/
 */
import { createThemeColors, rgb } from "../helpers.js";
export const CATPPUCCIN_MOCHA_THEME = {
    name: "catppuccin-mocha",
    description: "Soothing pastel theme",
    colors: createThemeColors({
        branch: rgb(137, 180, 250), // Blue
        changes: rgb(166, 227, 161), // Green
        contextLow: rgb(166, 227, 161), // Green
        contextMedium: rgb(238, 212, 159), // Yellow
        contextHigh: rgb(243, 139, 168), // Red
        linesAdded: rgb(166, 227, 161), // Green
        linesRemoved: rgb(243, 139, 168), // Red
        cost: rgb(245, 224, 220), // Rosewater
        model: rgb(203, 166, 247), // Mauve
        duration: rgb(147, 153, 178), // Text gray
        accent: rgb(243, 139, 168), // Pink
    }),
};
//# sourceMappingURL=catppuccin-mocha-theme.js.map