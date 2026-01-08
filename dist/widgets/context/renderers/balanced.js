/**
 * Balanced style renderer for ContextWidget
 *
 * Output format: `[████░░░] 71%`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { progressBar } from "../../../ui/utils/style-utils.js";
export class ContextBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        const bar = progressBar(data.percent, 10);
        return `[${bar}] ${data.percent}%`;
    }
}
//# sourceMappingURL=balanced.js.map