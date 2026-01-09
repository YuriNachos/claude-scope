/**
 * Gray theme - neutral gray colors for all widgets
 * Minimal color distraction
 */
import { gray } from "../utils/colors.js";
import { createThemeColors } from "./helpers.js";
export const GRAY_THEME = {
    name: "gray",
    description: "Neutral gray theme for minimal color distraction",
    colors: createThemeColors({
        branch: gray,
        changes: gray,
        contextLow: gray,
        contextMedium: gray,
        contextHigh: gray,
        linesAdded: gray,
        linesRemoved: gray,
        cost: gray,
        model: gray,
        duration: gray,
        accent: gray,
    }),
};
//# sourceMappingURL=gray-theme.js.map