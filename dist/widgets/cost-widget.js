/**
 * Cost Widget
 *
 * Displays total session cost
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { costStyles } from "./cost/styles.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class CostWidget extends StdinDataWidget {
    id = "cost";
    metadata = createWidgetMetadata("Cost", "Displays session cost in USD", "1.0.0", "claude-scope", 0 // First line
    );
    styleFn = costStyles.balanced;
    setStyle(style = "balanced") {
        const fn = costStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    renderWithData(data, _context) {
        if (!data.cost || data.cost.total_cost_usd === undefined)
            return null;
        const renderData = {
            costUsd: data.cost.total_cost_usd,
        };
        return this.styleFn(renderData);
    }
}
//# sourceMappingURL=cost-widget.js.map