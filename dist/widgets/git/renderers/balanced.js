/**
 * Balanced style renderer for GitWidget
 * Output: "main"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        return data.branch;
    }
}
//# sourceMappingURL=balanced.js.map