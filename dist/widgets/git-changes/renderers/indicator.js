/**
 * Indicator style renderer for GitChangesWidget
 * Output: "● +142 -27"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
export class GitChangesIndicatorRenderer extends BaseStyleRenderer {
    render(data) {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        const changes = parts.join(" ");
        return withIndicator(changes);
    }
}
//# sourceMappingURL=indicator.js.map