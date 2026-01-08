/**
 * Labeled style renderer for CostWidget
 * Output: "Cost: $0.42"
 */
import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class CostLabeledRenderer extends BaseStyleRenderer {
    render(data) {
        return `Cost: ${formatCostUSD(data.costUsd)}`;
    }
}
//# sourceMappingURL=labeled.js.map