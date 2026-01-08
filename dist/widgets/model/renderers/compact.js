/**
 * Compact style renderer for ModelWidget
 * Output: "Opus 4.5" (removes "Claude " prefix)
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ModelCompactRenderer extends BaseStyleRenderer {
    render(data) {
        // Remove "Claude " prefix if present
        return data.displayName.replace(/^Claude /, "");
    }
}
//# sourceMappingURL=compact.js.map