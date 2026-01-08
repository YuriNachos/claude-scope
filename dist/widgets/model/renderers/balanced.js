/**
 * Balanced style renderer for ModelWidget
 * Output: "Claude Opus 4.5"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ModelBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        return data.displayName;
    }
}
//# sourceMappingURL=balanced.js.map