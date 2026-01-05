/**
 * Model Widget
 *
 * Displays the current Claude model name
 */

import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import type { RenderContext } from '../core/types.js';

export class ModelWidget extends StdinDataWidget {
  readonly id = 'model';
  readonly metadata = createWidgetMetadata(
    'Model',
    'Displays the current Claude model name'
  );

  async render(context: RenderContext): Promise<string | null> {
    const data = this.getData();
    return data.model.display_name;
  }
}
