/**
 * Compact style renderer for DurationWidget
 * Output: "1h1m" (hours and minutes only)
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class DurationCompactRenderer extends BaseStyleRenderer {
    render(data) {
        const totalSeconds = Math.floor(data.durationMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h${minutes}m`;
        }
        return `${minutes}m`;
    }
}
//# sourceMappingURL=compact.js.map