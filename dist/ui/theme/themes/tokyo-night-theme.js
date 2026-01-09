/**
 * Tokyo Night theme
 * Clean, dark Tokyo-inspired
 * https://github.com/folke/tokyonight.nvim
 */
import { createThemeColors, rgb } from "../helpers.js";
export const TOKYO_NIGHT_THEME = {
    name: "tokyo-night",
    description: "Clean, dark Tokyo-inspired",
    colors: createThemeColors({
        branch: rgb(122, 132, 173), // Blue
        changes: rgb(122, 162, 247), // Dark blue
        contextLow: rgb(146, 180, 203), // Cyan
        contextMedium: rgb(232, 166, 162), // Pink-red
        contextHigh: rgb(249, 86, 119), // Red
        linesAdded: rgb(146, 180, 203), // Cyan
        linesRemoved: rgb(249, 86, 119), // Red
        cost: rgb(158, 206, 209), // Teal
        model: rgb(169, 177, 214), // White-ish
        duration: rgb(113, 119, 161), // Dark blue-gray
        accent: rgb(122, 132, 173), // Blue
    }),
};
//# sourceMappingURL=tokyo-night-theme.js.map