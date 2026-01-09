/**
 * Semantic Classic theme
 * Industry-standard semantic colors (green=success, red=error, yellow=warning)
 * Intuitive color mapping for maximum clarity
 */
import { createThemeColors, rgb } from "../helpers.js";
export const SEMANTIC_CLASSIC_THEME = {
    name: "semantic-classic",
    description: "Industry-standard semantic colors for maximum clarity",
    colors: createThemeColors({
        branch: rgb(59, 130, 246), // Blue
        changes: rgb(107, 114, 128), // Gray
        contextLow: rgb(34, 197, 94), // Green
        contextMedium: rgb(234, 179, 8), // Yellow
        contextHigh: rgb(239, 68, 68), // Red
        linesAdded: rgb(34, 197, 94), // Green
        linesRemoved: rgb(239, 68, 68), // Red
        cost: rgb(249, 115, 22), // Orange
        model: rgb(99, 102, 241), // Indigo
        duration: rgb(107, 114, 128), // Gray
        accent: rgb(59, 130, 246), // Blue
        cacheHigh: rgb(34, 197, 94), // Green
        cacheMedium: rgb(234, 179, 8), // Yellow
        cacheLow: rgb(239, 68, 68), // Red
        cacheRead: rgb(59, 130, 246), // Blue
        cacheWrite: rgb(99, 102, 241), // Indigo
        toolsRunning: rgb(234, 179, 8), // Yellow
        toolsCompleted: rgb(34, 197, 94), // Green
        toolsError: rgb(239, 68, 68), // Red
        toolsName: rgb(59, 130, 246), // Blue
        toolsTarget: rgb(107, 114, 128), // Gray
        toolsCount: rgb(99, 102, 241), // Indigo
    }),
};
//# sourceMappingURL=semantic-classic-theme.js.map