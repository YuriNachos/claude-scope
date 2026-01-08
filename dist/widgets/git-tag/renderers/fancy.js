/**
 * Fancy style renderer for GitTagWidget
 * Output: "⟨v0.5.4⟩" or "⟨—⟩"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
export class GitTagFancyRenderer extends BaseStyleRenderer {
    render(data) {
        return withAngleBrackets(data.tag || "—");
    }
}
//# sourceMappingURL=fancy.js.map