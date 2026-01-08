/**
 * Labeled style renderer for ModelWidget
 * Output: "Model: Opus 4.5"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ModelLabeledRenderer extends BaseStyleRenderer {
    render(data) {
        const shortName = data.displayName.replace(/^Claude /, "");
        return `Model: ${shortName}`;
    }
}
//# sourceMappingURL=labeled.js.map