/**
 * Duration Widget
 *
 * Displays elapsed session time
 */

import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { formatDuration } from '../utils/formatters.js';
import type { RenderContext } from '../core/types.js';

export class DurationWidget extends StdinDataWidget {
  readonly id = 'duration';
  readonly metadata = createWidgetMetadata(
    'Duration',
    'Displays elapsed session time'
  );

  async render(context: RenderContext): Promise<string | null> {
    const data = this.getData();
    return formatDuration(data.cost.total_duration_ms);
  }
}
