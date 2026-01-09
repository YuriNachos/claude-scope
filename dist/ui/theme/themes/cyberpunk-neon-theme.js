/**
 * Cyberpunk Neon theme
 * High-contrast neon cyberpunk aesthetic
 * Inspired by cyberpunk 2077 and synthwave visuals
 */
import { createThemeColors, rgb } from "../helpers.js";
export const CYBERPUNK_NEON_THEME = {
    name: "cyberpunk-neon",
    description: "High-contrast neon cyberpunk aesthetic",
    colors: createThemeColors({
        branch: rgb(0, 191, 255), // Cyan neon
        changes: rgb(255, 0, 122), // Magenta neon
        contextLow: rgb(0, 255, 122), // Green neon
        contextMedium: rgb(255, 214, 0), // Yellow neon
        contextHigh: rgb(255, 0, 122), // Magenta neon
        linesAdded: rgb(0, 255, 122), // Green neon
        linesRemoved: rgb(255, 0, 122), // Magenta neon
        cost: rgb(255, 111, 97), // Orange neon
        model: rgb(140, 27, 255), // Purple neon
        duration: rgb(0, 191, 255), // Cyan neon
        accent: rgb(255, 0, 122), // Magenta neon
    }),
};
//# sourceMappingURL=cyberpunk-neon-theme.js.map