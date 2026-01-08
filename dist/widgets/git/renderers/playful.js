/**
 * Playful style renderer for GitWidget
 * Output: "🔀 main"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitPlayfulRenderer extends BaseStyleRenderer {
    render(data) {
        return `🔀 ${data.branch}`;
    }
}
//# sourceMappingURL=playful.js.map