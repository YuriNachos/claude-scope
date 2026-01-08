/**
 * Compact style renderer for CostWidget
 * Output: "$0.42" (same as balanced for cost)
 */
import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class CostCompactRenderer extends BaseStyleRenderer {
    render(data) {
        return formatCostUSD(data.costUsd);
    }
}
//# sourceMappingURL=compact.js.map