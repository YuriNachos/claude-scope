/**
 * Solarized Dark theme
 * Precise CIELAB lightness
 * https://ethanschoonover.com/solarized/
 */
import { createThemeColors, rgb } from "../helpers.js";
export const SOLARIZED_DARK_THEME = {
    name: "solarized-dark",
    description: "Precise CIELAB lightness",
    colors: createThemeColors({
        branch: rgb(38, 139, 210), // Blue
        changes: rgb(133, 153, 0), // Olive
        contextLow: rgb(133, 153, 0), // Olive
        contextMedium: rgb(181, 137, 0), // Yellow
        contextHigh: rgb(220, 50, 47), // Red
        linesAdded: rgb(133, 153, 0), // Olive
        linesRemoved: rgb(220, 50, 47), // Red
        cost: rgb(203, 75, 22), // Orange
        model: rgb(131, 148, 150), // Base0
        duration: rgb(88, 110, 117), // Base01
        accent: rgb(38, 139, 210), // Blue
    }),
};
//# sourceMappingURL=solarized-dark-theme.js.map