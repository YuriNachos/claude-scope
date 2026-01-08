/**
 * Balanced style renderer for CostWidget
 * Output: "$0.42"
 */
import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class CostBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        return formatCostUSD(data.costUsd);
    }
}
//# sourceMappingURL=balanced.js.map