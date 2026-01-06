/**
 * Duration Widget
 *
 * Displays elapsed session time
 */

import { StdinDataWidget } from '#widgets/core/stdin-data-widget.js';
import { createWidgetMetadata } from '#core/widget-types.js';
import { formatDuration } from '#ui/utils/formatters.js';
import type { RenderContext, StdinData } from '#types.js';

export class DurationWidget extends StdinDataWidget {
  readonly id = 'duration';
  readonly metadata = createWidgetMetadata(
    'Duration',
    'Displays elapsed session time'
  );

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    if (!data.cost || data.cost.total_duration_ms === undefined) return null;
    return formatDuration(data.cost.total_duration_ms);
  }
}
