/**
 * Functional style renderers for GitTagWidget
 */
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
export const gitTagStyles = {
    balanced: (data, colors) => {
        const tag = data.tag || "—";
        if (!colors)
            return tag;
        return colorize(tag, colors.branch);
    },
    compact: (data, colors) => {
        if (!data.tag)
            return "—";
        // Remove "v" prefix if present
        const tag = data.tag.replace(/^v/, "");
        if (!colors)
            return tag;
        return colorize(tag, colors.branch);
    },
    playful: (data, colors) => {
        const tag = data.tag || "—";
        if (!colors)
            return `🏷️ ${tag}`;
        return `🏷️ ${colorize(tag, colors.branch)}`;
    },
    verbose: (data, colors) => {
        if (!data.tag)
            return "version: none";
        const tag = `version ${data.tag}`;
        if (!colors)
            return tag;
        return `version ${colorize(data.tag, colors.branch)}`;
    },
    labeled: (data, colors) => {
        const tag = data.tag || "none";
        if (!colors)
            return withLabel("Tag", tag);
        return withLabel("Tag", colorize(tag, colors.branch));
    },
    indicator: (data, colors) => {
        const tag = data.tag || "—";
        if (!colors)
            return withIndicator(tag);
        return withIndicator(colorize(tag, colors.branch));
    },
};
//# sourceMappingURL=styles.js.map