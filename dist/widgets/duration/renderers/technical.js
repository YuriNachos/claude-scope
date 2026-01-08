/**
 * Technical style renderer for DurationWidget
 * Output: "3665000ms"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class DurationTechnicalRenderer extends BaseStyleRenderer {
    render(data) {
        return `${Math.floor(data.durationMs)}ms`;
    }
}
//# sourceMappingURL=technical.js.map