/**
 * Playful style renderer for CostWidget
 * Output: "💰 $0.42"
 */
import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class CostPlayfulRenderer extends BaseStyleRenderer {
    render(data) {
        return `💰 ${formatCostUSD(data.costUsd)}`;
    }
}
//# sourceMappingURL=playful.js.map