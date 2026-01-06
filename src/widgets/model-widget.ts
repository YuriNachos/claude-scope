/**
 * Model Widget
 *
 * Displays the current Claude model name
 */

import { StdinDataWidget } from '#widgets/core/stdin-data-widget.js';
import { createWidgetMetadata } from '#core/widget-types.js';
import type { RenderContext, StdinData } from '#types.js';

export class ModelWidget extends StdinDataWidget {
  readonly id = 'model';
  readonly metadata = createWidgetMetadata(
    'Model',
    'Displays the current Claude model name'
  );

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    return data.model.display_name;
  }
}
