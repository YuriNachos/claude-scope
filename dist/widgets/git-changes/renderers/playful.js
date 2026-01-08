/**
 * Playful style renderer for GitChangesWidget
 * Output: "⬆142 ⬇27"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitChangesPlayfulRenderer extends BaseStyleRenderer {
    render(data) {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`⬆${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`⬇${data.deletions}`);
        return parts.join(" ");
    }
}
//# sourceMappingURL=playful.js.map