/**
 * Fancy style renderer for ModelWidget
 * Output: "[Opus 4.5]"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ModelFancyRenderer extends BaseStyleRenderer {
    render(data) {
        const shortName = data.displayName.replace(/^Claude /, "");
        return `[${shortName}]`;
    }
}
//# sourceMappingURL=fancy.js.map