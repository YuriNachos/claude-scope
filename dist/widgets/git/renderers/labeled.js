/**
 * Labeled style renderer for GitWidget
 * Output: "Git: main"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withLabel } from "../../../ui/utils/style-utils.js";
export class GitLabeledRenderer extends BaseStyleRenderer {
    render(data) {
        return withLabel("Git", data.branch);
    }
}
//# sourceMappingURL=labeled.js.map