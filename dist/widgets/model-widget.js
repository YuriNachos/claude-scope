/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { modelStyles } from "./model/styles.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class ModelWidget extends StdinDataWidget {
    id = "model";
    metadata = createWidgetMetadata("Model", "Displays the current Claude model name", "1.0.0", "claude-scope", 0 // First line
    );
    styleFn = modelStyles.balanced;
    setStyle(style = "balanced") {
        const fn = modelStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    renderWithData(data, _context) {
        const renderData = {
            displayName: data.model.display_name,
            id: data.model.id,
        };
        return this.styleFn(renderData);
    }
}
//# sourceMappingURL=model-widget.js.map