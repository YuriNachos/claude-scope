/**
 * Balanced style renderer for GitTagWidget
 * Output: "v0.5.4" or "—"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitTagBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        return data.tag || "—";
    }
}
//# sourceMappingURL=balanced.js.map