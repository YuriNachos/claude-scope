/**
 * Technical style renderer for GitChangesWidget
 * Output: "142/27"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitChangesTechnicalRenderer extends BaseStyleRenderer {
    render(data) {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`${data.insertions}`);
        if (data.deletions > 0)
            parts.push(`${data.deletions}`);
        return parts.join("/");
    }
}
//# sourceMappingURL=technical.js.map