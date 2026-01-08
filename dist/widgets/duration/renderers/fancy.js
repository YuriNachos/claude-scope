/**
 * Fancy style renderer for DurationWidget
 * Output: "⟨1h 1m 5s⟩"
 */
import { formatDuration } from "../../../ui/utils/formatters.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class DurationFancyRenderer extends BaseStyleRenderer {
    render(data) {
        return withAngleBrackets(formatDuration(data.durationMs));
    }
}
//# sourceMappingURL=fancy.js.map