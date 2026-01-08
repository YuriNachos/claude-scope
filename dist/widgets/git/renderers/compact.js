/**
 * Compact style renderer for GitWidget
 * Output: "main" (same as balanced for branch)
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitCompactRenderer extends BaseStyleRenderer {
    render(data) {
        return data.branch;
    }
}
//# sourceMappingURL=compact.js.map