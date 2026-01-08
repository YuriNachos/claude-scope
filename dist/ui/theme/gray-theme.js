import { gray, lightGray } from "../utils/colors.js";
/**
 * Gray theme - neutral gray colors for all widgets
 * This is the default theme, providing minimal color distraction
 */
export const GRAY_THEME = {
    name: "gray",
    description: "Neutral gray theme for minimal color distraction",
    colors: {
        base: {
            text: gray,
            muted: gray,
            accent: gray,
            border: gray,
        },
        semantic: {
            success: gray,
            warning: gray,
            error: gray,
            info: gray,
        },
        git: {
            branch: gray,
            changes: gray,
        },
        context: {
            low: gray,
            medium: gray,
            high: gray,
            bar: gray,
        },
        lines: {
            added: gray,
            removed: gray,
        },
        cost: {
            amount: gray,
            currency: gray,
        },
        duration: {
            value: gray,
            unit: gray,
        },
        model: {
            name: gray,
            version: gray,
        },
        poker: {
            participating: lightGray,
            nonParticipating: gray,
            result: gray,
        },
    },
};
//# sourceMappingURL=gray-theme.js.map