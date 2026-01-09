/**
 * Monokai theme
 * Vibrant, high-contrast
 * https://monokai.pro/
 */
import { createThemeColors, rgb } from "../helpers.js";
export const MONOKAI_THEME = {
    name: "monokai",
    description: "Vibrant, high-contrast",
    colors: createThemeColors({
        branch: rgb(102, 217, 239), // Cyan
        changes: rgb(249, 26, 114), // Pink
        contextLow: rgb(166, 226, 46), // Green
        contextMedium: rgb(253, 151, 31), // Orange
        contextHigh: rgb(249, 26, 114), // Pink
        linesAdded: rgb(166, 226, 46), // Green
        linesRemoved: rgb(249, 26, 114), // Pink
        cost: rgb(254, 128, 25), // Bright orange
        model: rgb(174, 129, 255), // Purple
        duration: rgb(102, 217, 239), // Cyan
        accent: rgb(249, 26, 114), // Pink
        cacheHigh: rgb(166, 226, 46), // Green
        cacheMedium: rgb(253, 151, 31), // Orange
        cacheLow: rgb(249, 26, 114), // Pink
        cacheRead: rgb(102, 217, 239), // Cyan
        cacheWrite: rgb(174, 129, 255), // Purple
        toolsRunning: rgb(253, 151, 31), // Orange
        toolsCompleted: rgb(166, 226, 46), // Green
        toolsError: rgb(249, 26, 114), // Pink
        toolsName: rgb(102, 217, 239), // Cyan
        toolsTarget: rgb(174, 129, 255), // Purple
        toolsCount: rgb(254, 128, 25), // Bright orange
    }),
};
//# sourceMappingURL=monokai-theme.js.map