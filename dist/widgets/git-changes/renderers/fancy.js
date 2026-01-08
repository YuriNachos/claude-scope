/**
 * Fancy style renderer for GitChangesWidget
 * Output: "⟨+142|-27⟩"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
export class GitChangesFancyRenderer extends BaseStyleRenderer {
    render(data) {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions}`);
        const changes = parts.join("|");
        return withAngleBrackets(changes);
    }
}
//# sourceMappingURL=fancy.js.map