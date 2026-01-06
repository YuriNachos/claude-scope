/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { progressBar, getContextColor, colorize } from '../utils/formatters.js';
import { DEFAULTS } from '../constants.js';
import type { RenderContext, StdinData } from '../types.js';

export class ContextWidget extends StdinDataWidget {
  readonly id = 'context';
  readonly metadata = createWidgetMetadata(
    'Context',
    'Displays context window usage with progress bar'
  );

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    const { current_usage, context_window_size } = data.context_window;

    if (!current_usage) return null;

    const used = current_usage.input_tokens +
                 current_usage.cache_creation_input_tokens +
                 current_usage.cache_read_input_tokens;

    const percent = Math.round((used / context_window_size) * 100);

    const bar = progressBar(percent, DEFAULTS.PROGRESS_BAR_WIDTH);
    const color = getContextColor(percent);

    return colorize(`[${bar}] ${percent}%`, color);
  }
}
