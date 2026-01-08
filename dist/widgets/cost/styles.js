/**
 * Functional style renderers for CostWidget
 */
import { formatCostUSD } from "../../ui/utils/formatters.js";
import { withLabel, withIndicator, withFancy } from "../../ui/utils/style-utils.js";
export const costStyles = {
    balanced: (data) => {
        return formatCostUSD(data.costUsd);
    },
    compact: (data) => {
        return formatCostUSD(data.costUsd);
    },
    playful: (data) => {
        return `💰 ${formatCostUSD(data.costUsd)}`;
    },
    labeled: (data) => {
        return withLabel("Cost", formatCostUSD(data.costUsd));
    },
    indicator: (data) => {
        return withIndicator(formatCostUSD(data.costUsd));
    },
    fancy: (data) => {
        return withFancy(formatCostUSD(data.costUsd));
    },
};
//# sourceMappingURL=styles.js.map