/**
 * Cost Widget
 *
 * Displays total session cost
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { costStyles } from "./cost/styles.js";
export class CostWidget extends StdinDataWidget {
    id = "cost";
    metadata = createWidgetMetadata("Cost", "Displays session cost in USD", "1.0.0", "claude-scope", 0 // First line
    );
    colors;
    _lineOverride;
    styleFn = costStyles.balanced;
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME;
    }
    setStyle(style = "balanced") {
        const fn = costStyles[style];
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
        if (!data.cost || data.cost.total_cost_usd === undefined)
            return null;
        const renderData = {
            costUsd: data.cost.total_cost_usd,
        };
        return this.styleFn(renderData, this.colors.cost);
    }
}
//# sourceMappingURL=cost-widget.js.map