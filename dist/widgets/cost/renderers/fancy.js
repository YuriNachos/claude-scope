/**
 * Fancy style renderer for CostWidget
 * Output: "«$0.42»"
 */
import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { withFancy } from "../../../ui/utils/style-utils.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class CostFancyRenderer extends BaseStyleRenderer {
    render(data) {
        return withFancy(formatCostUSD(data.costUsd));
    }
}
//# sourceMappingURL=fancy.js.map