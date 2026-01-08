/**
 * Labeled style renderer for DurationWidget
 * Output: "Time: 1h 1m 5s"
 */
import { formatDuration } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class DurationLabeledRenderer extends BaseStyleRenderer {
    render(data) {
        return `Time: ${formatDuration(data.durationMs)}`;
    }
}
//# sourceMappingURL=labeled.js.map