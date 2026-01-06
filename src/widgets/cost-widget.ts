/**
 * Cost Widget
 *
 * Displays total session cost
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { formatCostUSD } from '../ui/utils/formatters.js';
import type { RenderContext, StdinData } from '../types.js';

export class CostWidget extends StdinDataWidget {
  readonly id = 'cost';
  readonly metadata = createWidgetMetadata(
    'Cost',
    'Displays session cost in USD'
  );

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    if (!data.cost || data.cost.total_cost_usd === undefined) return null;
    return formatCostUSD(data.cost.total_cost_usd);
  }
}
