/**
 * Functional style renderers for GitChangesWidget
 */
import { withLabel, withIndicator, withAngleBrackets } from "../../ui/utils/style-utils.js";
export const gitChangesStyles = {
    balanced: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        return parts.join(" ");
    },
    compact: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        return parts.join("/");
    },
    playful: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`⬆${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`⬇${data.deletions}`);
        return parts.join(" ");
    },
    verbose: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions} insertions`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions} deletions`);
        return parts.join(", ");
    },
    technical: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`${data.deletions}`);
        return parts.join("/");
    },
    symbolic: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`▲${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`▼${data.deletions}`);
        return parts.join(" ");
    },
    labeled: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        const changes = parts.join(" ");
        return withLabel("Diff", changes);
    },
    indicator: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        const changes = parts.join(" ");
        return withIndicator(changes);
    },
    fancy: (data) => {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        const changes = parts.join("|");
        return withAngleBrackets(changes);
    },
};
//# sourceMappingURL=styles.js.map