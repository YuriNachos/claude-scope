/**
 * Cost Widget
 *
 * Displays session cost in USD
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { formatCostUSD } from '../utils/formatters.js';
export class CostWidget extends StdinDataWidget {
    id = 'cost';
    metadata = createWidgetMetadata('Cost', 'Displays session cost in USD');
    async render(context) {
        const data = this.getData();
        return formatCostUSD(data.cost.total_cost_usd);
    }
}
//# sourceMappingURL=cost-widget.js.map