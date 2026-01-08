/**
 * Labeled style renderer for GitTagWidget
 * Output: "Tag: v0.5.4" or "Tag: none"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withLabel } from "../../../ui/utils/style-utils.js";
export class GitTagLabeledRenderer extends BaseStyleRenderer {
    render(data) {
        return withLabel("Tag", data.tag || "none");
    }
}
//# sourceMappingURL=labeled.js.map