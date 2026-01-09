/**
 * Rosé Pine theme
 * Rose/violet themed
 * https://rosepinetheme.com/
 */
import { createThemeColors, rgb } from "../helpers.js";
export const ROSE_PINE_THEME = {
    name: "rose-pine",
    description: "Rose/violet themed",
    colors: createThemeColors({
        branch: rgb(156, 207, 216), // Pine cyan
        changes: rgb(235, 188, 186), // Rose
        contextLow: rgb(156, 207, 216), // Pine cyan
        contextMedium: rgb(233, 201, 176), // Pine beige
        contextHigh: rgb(235, 111, 146), // Pine red
        linesAdded: rgb(156, 207, 216), // Pine cyan
        linesRemoved: rgb(235, 111, 146), // Pine red
        cost: rgb(226, 185, 218), // Pine pink
        model: rgb(224, 208, 245), // Pine violet
        duration: rgb(148, 137, 176), // Pine mute
        accent: rgb(235, 111, 146), // Pine red
    }),
};
//# sourceMappingURL=rose-pine-theme.js.map