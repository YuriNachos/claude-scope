/**
 * Indicator style renderer for GitWidget
 * Output: "● main"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
export class GitIndicatorRenderer extends BaseStyleRenderer {
    render(data) {
        return withIndicator(data.branch);
    }
}
//# sourceMappingURL=indicator.js.map