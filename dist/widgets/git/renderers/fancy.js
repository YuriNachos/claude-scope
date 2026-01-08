/**
 * Fancy style renderer for GitWidget
 * Output: "[main]"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withBrackets } from "../../../ui/utils/style-utils.js";
export class GitFancyRenderer extends BaseStyleRenderer {
    render(data) {
        return withBrackets(data.branch);
    }
}
//# sourceMappingURL=fancy.js.map