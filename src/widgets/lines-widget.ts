/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { colorize } from '../ui/utils/formatters.js';
import { ANSI_COLORS } from '../constants.js';
import type { RenderContext, StdinData } from '../types.js';

/**
 * Widget displaying lines added/removed in session
 *
 * Shows green "+N" for lines added and red "-N" for lines removed.
 * Defaults to "+0/-0" when cost data is unavailable.
 */
export class LinesWidget extends StdinDataWidget {
  readonly id = 'lines';
  readonly metadata = createWidgetMetadata(
    'Lines',
    'Displays lines added/removed in session'
  );

  protected renderWithData(
    data: StdinData,
    context: RenderContext
  ): string | null {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;

    const addedStr = colorize(`+${added}`, ANSI_COLORS.GREEN);
    const removedStr = colorize(`-${removed}`, ANSI_COLORS.RED);

    return `${addedStr}/${removedStr}`;
  }
}
