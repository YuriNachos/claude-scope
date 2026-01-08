/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import { colorize } from "../ui/utils/formatters.js";
import { DEFAULT_THEME } from "../ui/theme/default-theme.js";
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
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME.lines;
    }
    renderWithData(data, context) {
        const added = data.cost?.total_lines_added ?? 0;
        const removed = data.cost?.total_lines_removed ?? 0;
        const addedStr = colorize(`+${added}`, this.colors.added);
        const removedStr = colorize(`-${removed}`, this.colors.removed);
        return `${addedStr}/${removedStr}`;
    }
}
//# sourceMappingURL=lines-widget.js.map