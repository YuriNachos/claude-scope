/**
 * Compact style renderer for ContextWidget
 *
 * Output format: `71%`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ContextCompactRenderer extends BaseStyleRenderer {
    render(data) {
        return `${data.percent}%`;
    }
}
//# sourceMappingURL=compact.js.map