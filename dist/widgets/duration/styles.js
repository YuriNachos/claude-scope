/**
 * Functional style renderers for DurationWidget
 */
import { colorize } from "../../ui/utils/colors.js";
import { formatDuration } from "../../ui/utils/formatters.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
export const durationStyles = {
    balanced: (data, colors) => {
        const formatted = formatDuration(data.durationMs);
        if (!colors)
            return formatted;
        // Colorize the value part, keep units muted
        return formatDurationWithColors(data.durationMs, colors);
    },
    compact: (data, colors) => {
        const totalSeconds = Math.floor(data.durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (!colors) {
            if (hours > 0) {
                return `${hours}h${minutes}m`;
            }
            return `${minutes}m`;
        }
        if (hours > 0) {
            return (colorize(`${hours}`, colors.value) +
                colorize("h", colors.unit) +
                colorize(`${minutes}`, colors.value) +
                colorize("m", colors.unit));
        }
        return colorize(`${minutes}`, colors.value) + colorize("m", colors.unit);
    },
    playful: (data, colors) => {
        const totalSeconds = Math.floor(data.durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (!colors) {
            if (hours > 0) {
                return `⌛ ${hours}h ${minutes}m`;
            }
            return `⌛ ${minutes}m`;
        }
        if (hours > 0) {
            const colored = colorize(`${hours}`, colors.value) +
                colorize("h", colors.unit) +
                colorize(` ${minutes}`, colors.value) +
                colorize("m", colors.unit);
            return `⌛ ${colored}`;
        }
        return `⌛ ` + colorize(`${minutes}`, colors.value) + colorize("m", colors.unit);
    },
    technical: (data, colors) => {
        const value = `${Math.floor(data.durationMs)}ms`;
        if (!colors)
            return value;
        return colorize(`${Math.floor(data.durationMs)}`, colors.value) + colorize("ms", colors.unit);
    },
    labeled: (data, colors) => {
        const formatted = formatDuration(data.durationMs);
        if (!colors)
            return withLabel("Time", formatted);
        const colored = formatDurationWithColors(data.durationMs, colors);
        return withLabel("Time", colored);
    },
    indicator: (data, colors) => {
        const formatted = formatDuration(data.durationMs);
        if (!colors)
            return withIndicator(formatted);
        const colored = formatDurationWithColors(data.durationMs, colors);
        return withIndicator(colored);
    },
};
/**
 * Helper to format duration with colors
 * Parses the formatted duration and applies colors to values and units
 */
function formatDurationWithColors(ms, colors) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) {
        parts.push(colorize(`${hours}`, colors.value) + colorize("h", colors.unit));
    }
    if (minutes > 0) {
        parts.push(colorize(`${minutes}`, colors.value) + colorize("m", colors.unit));
    }
    if (seconds > 0 || parts.length === 0) {
        parts.push(colorize(`${seconds}`, colors.value) + colorize("s", colors.unit));
    }
    return parts.join(" ");
}
//# sourceMappingURL=styles.js.map