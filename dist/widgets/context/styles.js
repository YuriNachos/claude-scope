/**
 * Functional style renderers for ContextWidget
 *
 * All rendering logic as pure functions instead of classes.
 * Style functions now handle colorization based on usage percent.
 */
import { colorize } from "../../ui/utils/colors.js";
import { progressBar } from "../../ui/utils/style-utils.js";
/**
 * Get the appropriate color based on context usage percentage
 */
function getContextColor(percent, colors) {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    if (clampedPercent < 50) {
        return colors.low;
    }
    else if (clampedPercent < 80) {
        return colors.medium;
    }
    else {
        return colors.high;
    }
}
export const contextStyles = {
    balanced: (data, colors) => {
        const bar = progressBar(data.percent, 10);
        const output = `[${bar}] ${data.percent}%`;
        if (!colors)
            return output;
        return colorize(output, getContextColor(data.percent, colors));
    },
    compact: (data, colors) => {
        const output = `${data.percent}%`;
        if (!colors)
            return output;
        return colorize(output, getContextColor(data.percent, colors));
    },
    playful: (data, colors) => {
        const bar = progressBar(data.percent, 10);
        const output = `🧠 [${bar}] ${data.percent}%`;
        if (!colors)
            return output;
        return `🧠 ${colorize(`[${bar}] ${data.percent}%`, getContextColor(data.percent, colors))}`;
    },
    verbose: (data, colors) => {
        const usedFormatted = data.used.toLocaleString();
        const maxFormatted = data.contextWindowSize.toLocaleString();
        const output = `${usedFormatted} / ${maxFormatted} tokens (${data.percent}%)`;
        if (!colors)
            return output;
        return colorize(output, getContextColor(data.percent, colors));
    },
    symbolic: (data, colors) => {
        const filled = Math.round((data.percent / 100) * 5);
        const empty = 5 - filled;
        const output = `${"▮".repeat(filled)}${"▯".repeat(empty)} ${data.percent}%`;
        if (!colors)
            return output;
        return colorize(output, getContextColor(data.percent, colors));
    },
    "compact-verbose": (data, colors) => {
        const usedK = data.used >= 1000 ? `${Math.floor(data.used / 1000)}K` : data.used.toString();
        const maxK = data.contextWindowSize >= 1000
            ? `${Math.floor(data.contextWindowSize / 1000)}K`
            : data.contextWindowSize.toString();
        const output = `${data.percent}% (${usedK}/${maxK})`;
        if (!colors)
            return output;
        return colorize(output, getContextColor(data.percent, colors));
    },
    indicator: (data, colors) => {
        const output = `● ${data.percent}%`;
        if (!colors)
            return output;
        return colorize(output, getContextColor(data.percent, colors));
    },
};
//# sourceMappingURL=styles.js.map