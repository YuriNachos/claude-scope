/**
 * Functional style renderers for GitWidget
 */
import { withIndicator } from "../../ui/utils/style-utils.js";
export const gitStyles = {
    minimal: (data) => {
        return data.branch;
    },
    balanced: (data) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                return `${data.branch} [${parts.join(" ")}]`;
            }
        }
        return data.branch;
    },
    compact: (data) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                return `${data.branch} ${parts.join("/")}`;
            }
        }
        return data.branch;
    },
    playful: (data) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`⬆${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`⬇${data.changes.deletions}`);
            if (parts.length > 0) {
                return `🔀 ${data.branch} ${parts.join(" ")}`;
            }
        }
        return `🔀 ${data.branch}`;
    },
    verbose: (data) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions} insertions`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions} deletions`);
            if (parts.length > 0) {
                return `branch: ${data.branch} [${parts.join(", ")}]`;
            }
        }
        return `branch: ${data.branch} (HEAD)`;
    },
    labeled: (data) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                const changes = `${data.changes.files} files: ${parts.join("/")}`;
                return `Git: ${data.branch} [${changes}]`;
            }
        }
        return `Git: ${data.branch}`;
    },
    indicator: (data) => {
        if (data.changes && data.changes.files > 0) {
            const parts = [];
            if (data.changes.insertions > 0)
                parts.push(`+${data.changes.insertions}`);
            if (data.changes.deletions > 0)
                parts.push(`-${data.changes.deletions}`);
            if (parts.length > 0) {
                return `● ${data.branch} [${parts.join(" ")}]`;
            }
        }
        return withIndicator(data.branch);
    },
};
//# sourceMappingURL=styles.js.map