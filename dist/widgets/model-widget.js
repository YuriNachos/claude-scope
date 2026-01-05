/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
export class ModelWidget extends StdinDataWidget {
    id = 'model';
    metadata = createWidgetMetadata('Model', 'Displays the current Claude model name');
    async render(context) {
        const data = this.getData();
        return data.model.display_name;
    }
}
//# sourceMappingURL=model-widget.js.map