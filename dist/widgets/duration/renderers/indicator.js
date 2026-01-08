/**
 * Indicator style renderer for DurationWidget
 * Output: "● 1h 1m 5s"
 */
import { formatDuration } from "../../../ui/utils/formatters.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class DurationIndicatorRenderer extends BaseStyleRenderer {
    render(data) {
        return withIndicator(formatDuration(data.durationMs));
    }
}
//# sourceMappingURL=indicator.js.map