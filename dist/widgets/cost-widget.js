/**
 * Cost Widget
 *
 * Displays total session cost
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { CostBalancedRenderer } from "./cost/renderers/balanced.js";
import { CostCompactRenderer } from "./cost/renderers/compact.js";
import { CostFancyRenderer } from "./cost/renderers/fancy.js";
import { CostIndicatorRenderer } from "./cost/renderers/indicator.js";
import { CostLabeledRenderer } from "./cost/renderers/labeled.js";
import { CostPlayfulRenderer } from "./cost/renderers/playful.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class CostWidget extends StdinDataWidget {
    id = "cost";
    metadata = createWidgetMetadata("Cost", "Displays session cost in USD", "1.0.0", "claude-scope", 0 // First line
    );
    renderer = new CostBalancedRenderer();
    setStyle(style) {
        switch (style) {
            case "balanced":
                this.renderer = new CostBalancedRenderer();
                break;
            case "compact":
                this.renderer = new CostCompactRenderer();
                break;
            case "playful":
                this.renderer = new CostPlayfulRenderer();
                break;
            case "labeled":
                this.renderer = new CostLabeledRenderer();
                break;
            case "indicator":
                this.renderer = new CostIndicatorRenderer();
                break;
            case "fancy":
                this.renderer = new CostFancyRenderer();
                break;
            default:
                this.renderer = new CostBalancedRenderer();
        }
    }
    renderWithData(data, _context) {
        if (!data.cost || data.cost.total_cost_usd === undefined)
            return null;
        const renderData = {
            costUsd: data.cost.total_cost_usd,
        };
        return this.renderer.render(renderData);
    }
}
//# sourceMappingURL=cost-widget.js.map