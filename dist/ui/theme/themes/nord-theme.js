/**
 * Nord theme
 * Arctic, north-bluish color palette
 * https://www.nordtheme.com/
 */
import { createThemeColors, rgb } from "../helpers.js";
export const NORD_THEME = {
    name: "nord",
    description: "Arctic, north-bluish color palette",
    colors: createThemeColors({
        branch: rgb(136, 192, 208), // Nordic cyan
        changes: rgb(143, 188, 187), // Nordic blue-gray
        contextLow: rgb(163, 190, 140), // Nordic green
        contextMedium: rgb(235, 203, 139), // Nordic yellow
        contextHigh: rgb(191, 97, 106), // Nordic red
        linesAdded: rgb(163, 190, 140), // Nordic green
        linesRemoved: rgb(191, 97, 106), // Nordic red
        cost: rgb(216, 222, 233), // Nordic white
        model: rgb(129, 161, 193), // Nordic blue
        duration: rgb(94, 129, 172), // Nordic dark blue
        accent: rgb(136, 192, 208), // Nordic cyan
    }),
};
//# sourceMappingURL=nord-theme.js.map