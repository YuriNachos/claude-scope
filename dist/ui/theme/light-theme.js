import { blue, bold, dim, gray, green, red, yellow } from "../utils/colors.js";
/**
 * Light theme - darker colors for light background terminals
 * Optimized for terminals with light backgrounds
 */
export const LIGHT_THEME = {
    name: "light",
    description: "Light theme with darker colors for light backgrounds",
    colors: {
        base: {
            text: "\x1b[30m", // black (dark gray)
            muted: gray,
            accent: blue,
            border: gray,
        },
        semantic: {
            success: green,
            warning: yellow,
            error: red,
            info: blue,
        },
        git: {
            branch: blue,
            changes: gray,
        },
        context: {
            low: green,
            medium: yellow,
            high: red,
            bar: blue,
        },
        lines: {
            added: green,
            removed: red,
        },
        cost: {
            amount: yellow,
            currency: gray,
        },
        duration: {
            value: "\x1b[30m", // black (dark gray)
            unit: gray,
        },
        model: {
            name: blue,
            version: gray,
        },
        poker: {
            participating: bold,
            nonParticipating: dim,
            result: green,
        },
    },
};
//# sourceMappingURL=light-theme.js.map