/**
 * Functional style renderers for ModelWidget
 */
import { withLabel, withIndicator, withBrackets } from "../../ui/utils/style-utils.js";
function getShortName(displayName) {
    return displayName.replace(/^Claude\s+/, "");
}
export const modelStyles = {
    balanced: (data) => {
        return data.displayName;
    },
    compact: (data) => {
        return getShortName(data.displayName);
    },
    playful: (data) => {
        return `🤖 ${getShortName(data.displayName)}`;
    },
    technical: (data) => {
        return data.id;
    },
    symbolic: (data) => {
        return `◆ ${getShortName(data.displayName)}`;
    },
    labeled: (data) => {
        return withLabel("Model", getShortName(data.displayName));
    },
    indicator: (data) => {
        return withIndicator(getShortName(data.displayName));
    },
    fancy: (data) => {
        return withBrackets(getShortName(data.displayName));
    },
};
//# sourceMappingURL=styles.js.map