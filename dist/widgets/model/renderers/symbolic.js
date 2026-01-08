/**
 * Symbolic style renderer for ModelWidget
 * Output: "◆ Opus 4.5"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ModelSymbolicRenderer extends BaseStyleRenderer {
    render(data) {
        const shortName = data.displayName.replace(/^Claude /, "");
        return `◆ ${shortName}`;
    }
}
//# sourceMappingURL=symbolic.js.map