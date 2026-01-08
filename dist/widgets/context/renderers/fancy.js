/**
 * Fancy style renderer for ContextWidget
 *
 * Output format: `⟨71%⟩`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
export class ContextFancyRenderer extends BaseStyleRenderer {
    render(data) {
        return withAngleBrackets(`${data.percent}%`);
    }
}
//# sourceMappingURL=fancy.js.map