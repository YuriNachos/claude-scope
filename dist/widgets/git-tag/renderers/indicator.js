/**
 * Indicator style renderer for GitTagWidget
 * Output: "● v0.5.4" or "● —"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
export class GitTagIndicatorRenderer extends BaseStyleRenderer {
    render(data) {
        return withIndicator(data.tag || "—");
    }
}
//# sourceMappingURL=indicator.js.map