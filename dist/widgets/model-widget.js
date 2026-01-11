/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { modelStyles } from "./model/styles.js";
export class ModelWidget extends StdinDataWidget {
    id = "model";
    metadata = createWidgetMetadata("Model", "Displays the current Claude model name", "1.0.0", "claude-scope", 0 // First line
    );
    colors;
    _lineOverride;
    styleFn = modelStyles.balanced;
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME;
    }
    setStyle(style = "balanced") {
        const fn = modelStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    setLine(line) {
        this._lineOverride = line;
    }
    getLine() {
        return this._lineOverride ?? this.metadata.line ?? 0;
    }
    renderWithData(data, _context) {
        const renderData = {
            displayName: data.model.display_name,
            id: data.model.id,
        };
        return this.styleFn(renderData, this.colors.model);
    }
}
//# sourceMappingURL=model-widget.js.map