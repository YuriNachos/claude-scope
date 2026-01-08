/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { durationStyles } from "./duration/styles.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class DurationWidget extends StdinDataWidget {
    id = "duration";
    metadata = createWidgetMetadata("Duration", "Displays elapsed session time", "1.0.0", "claude-scope", 0 // First line
    );
    styleFn = durationStyles.balanced;
    setStyle(style = "balanced") {
        const fn = durationStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    renderWithData(data, _context) {
        if (!data.cost || data.cost.total_duration_ms === undefined)
            return null;
        const renderData = {
            durationMs: data.cost.total_duration_ms,
        };
        return this.styleFn(renderData);
    }
}
//# sourceMappingURL=duration-widget.js.map