/**
 * Functional style renderers for DurationWidget
 */
import { formatDuration } from "../../ui/utils/formatters.js";
import { withIndicator, withAngleBrackets, withLabel } from "../../ui/utils/style-utils.js";
export const durationStyles = {
    balanced: (data) => {
        return formatDuration(data.durationMs);
    },
    compact: (data) => {
        const totalSeconds = Math.floor(data.durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h${minutes}m`;
        }
        return `${minutes}m`;
    },
    playful: (data) => {
        const totalSeconds = Math.floor(data.durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) {
            return `⌛ ${hours}h ${minutes}m`;
        }
        return `⌛ ${minutes}m`;
    },
    technical: (data) => {
        return `${Math.floor(data.durationMs)}ms`;
    },
    labeled: (data) => {
        return withLabel("Time", formatDuration(data.durationMs));
    },
    indicator: (data) => {
        return withIndicator(formatDuration(data.durationMs));
    },
    fancy: (data) => {
        return withAngleBrackets(formatDuration(data.durationMs));
    },
};
//# sourceMappingURL=styles.js.map