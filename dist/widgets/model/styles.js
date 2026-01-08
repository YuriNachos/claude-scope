/**
 * Functional style renderers for ModelWidget
 */
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
function getShortName(displayName) {
    return displayName.replace(/^Claude\s+/, "");
}
export const modelStyles = {
    balanced: (data, colors) => {
        if (!colors)
            return data.displayName;
        return colorize(data.displayName, colors.name);
    },
    compact: (data, colors) => {
        const shortName = getShortName(data.displayName);
        if (!colors)
            return shortName;
        return colorize(shortName, colors.name);
    },
    playful: (data, colors) => {
        const shortName = getShortName(data.displayName);
        if (!colors)
            return `🤖 ${shortName}`;
        return `🤖 ${colorize(shortName, colors.name)}`;
    },
    technical: (data, colors) => {
        if (!colors)
            return data.id;
        // Colorize name part, keep version muted
        const match = data.id.match(/^(.+?)-(\d[\d.]*)$/);
        if (match) {
            return colorize(match[1], colors.name) + colorize(`-${match[2]}`, colors.version);
        }
        return colorize(data.id, colors.name);
    },
    symbolic: (data, colors) => {
        const shortName = getShortName(data.displayName);
        if (!colors)
            return `◆ ${shortName}`;
        return `◆ ${colorize(shortName, colors.name)}`;
    },
    labeled: (data, colors) => {
        const shortName = getShortName(data.displayName);
        if (!colors)
            return withLabel("Model", shortName);
        return withLabel("Model", colorize(shortName, colors.name));
    },
    indicator: (data, colors) => {
        const shortName = getShortName(data.displayName);
        if (!colors)
            return withIndicator(shortName);
        return withIndicator(colorize(shortName, colors.name));
    },
};
//# sourceMappingURL=styles.js.map