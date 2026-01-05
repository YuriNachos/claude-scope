/**
 * Cost Widget
 *
 * Displays session cost in USD
 */

import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { formatCostUSD } from '../utils/formatters.js';
import type { RenderContext } from '../core/types.js';

export class CostWidget extends StdinDataWidget {
  readonly id = 'cost';
  readonly metadata = createWidgetMetadata(
    'Cost',
    'Displays session cost in USD'
  );

  async render(context: RenderContext): Promise<string | null> {
    const data = this.getData();
    return formatCostUSD(data.cost.total_cost_usd);
  }
}
