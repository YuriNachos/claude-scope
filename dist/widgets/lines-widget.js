/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { linesStyles } from "./lines/styles.js";
/**
 * Widget displaying lines added/removed in session
 *
 * Shows colored "+N" for lines added and "-N" for lines removed.
 * Defaults to "+0/-0" when cost data is unavailable.
 */
export class LinesWidget extends StdinDataWidget {
    id = "lines";
    metadata = createWidgetMetadata("Lines", "Displays lines added/removed in session", "1.0.0", "claude-scope", 0 // First line
    );
    colors;
    styleFn = linesStyles.balanced;
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME;
    }
    setStyle(style = "balanced") {
        const fn = linesStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    renderWithData(data, _context) {
        const added = data.cost?.total_lines_added ?? 0;
        const removed = data.cost?.total_lines_removed ?? 0;
        const renderData = { added, removed };
        return this.styleFn(renderData, this.colors.lines);
    }
}
//# sourceMappingURL=lines-widget.js.map