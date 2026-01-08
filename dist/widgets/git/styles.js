/**
 * Functional style renderers for GitWidget
 */
import { withLabel, withIndicator, withBrackets } from "../../ui/utils/style-utils.js";
export const gitStyles = {
    balanced: (data) => {
        return data.branch;
    },
    compact: (data) => {
        return data.branch;
    },
    playful: (data) => {
        return `🔀 ${data.branch}`;
    },
    verbose: (data) => {
        return `branch: ${data.branch} (HEAD)`;
    },
    labeled: (data) => {
        return withLabel("Git", data.branch);
    },
    indicator: (data) => {
        return withIndicator(data.branch);
    },
    fancy: (data) => {
        return withBrackets(data.branch);
    },
};
//# sourceMappingURL=styles.js.map