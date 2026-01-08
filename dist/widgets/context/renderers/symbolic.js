/**
 * Symbolic style renderer for ContextWidget
 *
 * Output format: `▮▮▮▮▯ 71%`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ContextSymbolicRenderer extends BaseStyleRenderer {
    render(data) {
        const filled = Math.round((data.percent / 100) * 5);
        const empty = 5 - filled;
        const bar = "▮".repeat(filled) + "▯".repeat(empty);
        return `${bar} ${data.percent}%`;
    }
}
//# sourceMappingURL=symbolic.js.map