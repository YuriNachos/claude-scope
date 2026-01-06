/**
 * Model Widget
 *
 * Displays the current Claude model name
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import type { RenderContext, StdinData } from '../types.js';

export class ModelWidget extends StdinDataWidget {
  readonly id = 'model';
  readonly metadata = createWidgetMetadata(
    'Model',
    'Displays the current Claude model name',
    '1.0.0',
    'claude-scope',
    0  // First line
  );

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    return data.model.display_name;
  }
}
