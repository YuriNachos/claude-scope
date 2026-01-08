/**
 * Functional style renderers for GitTagWidget
 */
import { withLabel, withIndicator, withAngleBrackets } from "../../ui/utils/style-utils.js";
export const gitTagStyles = {
    balanced: (data) => {
        return data.tag || "—";
    },
    compact: (data) => {
        if (!data.tag)
            return "—";
        // Remove "v" prefix if present
        return data.tag.replace(/^v/, "");
    },
    playful: (data) => {
        return `🏷️ ${data.tag || "—"}`;
    },
    verbose: (data) => {
        if (!data.tag)
            return "version: none";
        return `version ${data.tag}`;
    },
    labeled: (data) => {
        return withLabel("Tag", data.tag || "none");
    },
    indicator: (data) => {
        return withIndicator(data.tag || "—");
    },
    fancy: (data) => {
        return withAngleBrackets(data.tag || "—");
    },
};
//# sourceMappingURL=styles.js.map