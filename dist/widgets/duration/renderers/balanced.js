/**
 * Balanced style renderer for DurationWidget
 * Output: "1h 1m 5s"
 */
import { formatDuration } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class DurationBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        return formatDuration(data.durationMs);
    }
}
//# sourceMappingURL=balanced.js.map