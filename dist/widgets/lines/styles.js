/**
 * Functional style renderers for LinesWidget
 *
 * These style functions accept colors as a parameter to support color customization.
 */
import { colorize } from "../../ui/utils/formatters.js";
import { withLabel, withIndicator } from "../../ui/utils/style-utils.js";
/**
 * Create a style map with colors bound to the style functions
 */
export function createLinesStyles(colors) {
    return {
        balanced: (data) => {
            const addedStr = colorize(`+${data.added}`, colors.added);
            const removedStr = colorize(`-${data.removed}`, colors.removed);
            return `${addedStr}/${removedStr}`;
        },
        compact: (data) => {
            const addedStr = colorize(`+${data.added}`, colors.added);
            const removedStr = colorize(`-${data.removed}`, colors.removed);
            return `${addedStr}${removedStr}`;
        },
        playful: (data) => {
            const addedStr = colorize(`➕${data.added}`, colors.added);
            const removedStr = colorize(`➖${data.removed}`, colors.removed);
            return `${addedStr} ${removedStr}`;
        },
        verbose: (data) => {
            const parts = [];
            if (data.added > 0) {
                parts.push(colorize(`+${data.added} added`, colors.added));
            }
            if (data.removed > 0) {
                parts.push(colorize(`-${data.removed} removed`, colors.removed));
            }
            return parts.join(", ");
        },
        labeled: (data) => {
            const addedStr = colorize(`+${data.added}`, colors.added);
            const removedStr = colorize(`-${data.removed}`, colors.removed);
            const lines = `${addedStr}/${removedStr}`;
            return withLabel("Lines", lines);
        },
        indicator: (data) => {
            const addedStr = colorize(`+${data.added}`, colors.added);
            const removedStr = colorize(`-${data.removed}`, colors.removed);
            const lines = `${addedStr}/${removedStr}`;
            return withIndicator(lines);
        },
    };
}
//# sourceMappingURL=styles.js.map