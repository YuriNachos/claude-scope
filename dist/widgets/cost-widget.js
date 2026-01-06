/**
 * Cost Widget
 *
 * Displays total session cost
 */
import { StdinDataWidget } from '#widgets/core/stdin-data-widget.js';
import { createWidgetMetadata } from '#core/widget-types.js';
import { formatCostUSD } from '#ui/utils/formatters.js';
export class CostWidget extends StdinDataWidget {
    id = 'cost';
    metadata = createWidgetMetadata('Cost', 'Displays session cost in USD');
    renderWithData(data, context) {
        if (!data.cost || data.cost.total_cost_usd === undefined)
            return null;
        return formatCostUSD(data.cost.total_cost_usd);
    }
}
//# sourceMappingURL=cost-widget.js.map