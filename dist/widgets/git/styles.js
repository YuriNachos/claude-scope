/**
 * Functional style renderers for GitWidget
 */
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator } from "../../ui/utils/style-utils.js";
export const gitStyles = {
    minimal: (data, colors) => {
        if (!colors)
            return data.branch;
        return colorize(data.branch, colors.branch);
    },
    balanced: (data, colors) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
                const changes = colors
                    ? colorize(`[${parts.join(" ")}]`, colors.changes)
                    : `[${parts.join(" ")}]`;
                return `${branch} ${changes}`;
            }
        }
        return colors ? colorize(data.branch, colors.branch) : data.branch;
    },
    compact: (data, colors) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
                const changesStr = parts.join("/");
                return `${branch} ${changesStr}`;
            }
        }
        return colors ? colorize(data.branch, colors.branch) : data.branch;
    },
    playful: (data, colors) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`⬆${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`⬇${data.changes.deletions}`);
            if (parts.length > 0) {
                const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
                return `🔀 ${branch} ${parts.join(" ")}`;
            }
        }
        const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
        return `🔀 ${branch}`;
    },
    verbose: (data, colors) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions} insertions`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions} deletions`);
            if (parts.length > 0) {
                const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
                const changes = colors
                    ? colorize(`[${parts.join(", ")}]`, colors.changes)
                    : `[${parts.join(", ")}]`;
                return `branch: ${branch} ${changes}`;
            }
        }
        const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
        return `branch: ${branch} (HEAD)`;
    },
    labeled: (data, colors) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
                const changes = `${data.changes.files} files: ${parts.join("/")}`;
                return `Git: ${branch} [${changes}]`;
            }
        }
        const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
        return `Git: ${branch}`;
    },
    indicator: (data, colors) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
                const changes = colors
                    ? colorize(`[${parts.join(" ")}]`, colors.changes)
                    : `[${parts.join(" ")}]`;
                return `● ${branch} ${changes}`;
            }
        }
        return withIndicator(colors ? colorize(data.branch, colors.branch) : data.branch);
    },
};
//# sourceMappingURL=styles.js.map