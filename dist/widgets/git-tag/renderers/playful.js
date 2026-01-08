/**
 * Playful style renderer for GitTagWidget
 * Output: "🏷️ v0.5.4" or "🏷️ —"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitTagPlayfulRenderer extends BaseStyleRenderer {
    render(data) {
        return `🏷️ ${data.tag || "—"}`;
    }
}
//# sourceMappingURL=playful.js.map