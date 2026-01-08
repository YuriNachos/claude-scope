/**
 * Indicator style renderer for ModelWidget
 * Output: "● Opus 4.5"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ModelIndicatorRenderer extends BaseStyleRenderer {
    render(data) {
        const shortName = data.displayName.replace(/^Claude /, "");
        return `● ${shortName}`;
    }
}
//# sourceMappingURL=indicator.js.map