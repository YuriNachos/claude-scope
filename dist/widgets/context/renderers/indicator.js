/**
 * Indicator style renderer for ContextWidget
 *
 * Output format: `● 71%`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
export class ContextIndicatorRenderer extends BaseStyleRenderer {
    render(data) {
        return withIndicator(`${data.percent}%`);
    }
}
//# sourceMappingURL=indicator.js.map