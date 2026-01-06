/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
export class ModelWidget extends StdinDataWidget {
    id = 'model';
    metadata = createWidgetMetadata('Model', 'Displays the current Claude model name', '1.0.0', 'claude-scope', 0 // First line
    );
    renderWithData(data, context) {
        return data.model.display_name;
    }
}
//# sourceMappingURL=model-widget.js.map