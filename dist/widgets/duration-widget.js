/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { durationStyles } from "./duration/styles.js";
export class DurationWidget extends StdinDataWidget {
    id = "duration";
    metadata = createWidgetMetadata("Duration", "Displays elapsed session time", "1.0.0", "claude-scope", 0 // First line
    );
    colors;
    _lineOverride;
    styleFn = durationStyles.balanced;
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME;
    }
    setStyle(style = "balanced") {
        const fn = durationStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    setLine(line) {
        this._lineOverride = line;
    }
    getLine() {
        return this._lineOverride ?? this.metadata.line ?? 0;
    }
    renderWithData(data, _context) {
        if (!data.cost || data.cost.total_duration_ms === undefined)
            return null;
        const renderData = {
            durationMs: data.cost.total_duration_ms,
        };
        return this.styleFn(renderData, this.colors.duration);
    }
}
//# sourceMappingURL=duration-widget.js.map