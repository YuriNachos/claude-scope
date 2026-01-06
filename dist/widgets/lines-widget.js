/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { colorize } from '../ui/utils/formatters.js';
import { ANSI_COLORS } from '../constants.js';
/**
 * Widget displaying lines added/removed in session
 *
 * Shows green "+N" for lines added and red "-N" for lines removed.
 * Defaults to "+0/-0" when cost data is unavailable.
 */
export class LinesWidget extends StdinDataWidget {
    id = 'lines';
    metadata = createWidgetMetadata('Lines', 'Displays lines added/removed in session');
    renderWithData(data, context) {
        const added = data.cost?.total_lines_added ?? 0;
        const removed = data.cost?.total_lines_removed ?? 0;
        const addedStr = colorize(`+${added}`, ANSI_COLORS.GREEN);
        const removedStr = colorize(`-${removed}`, ANSI_COLORS.RED);
        return `${addedStr}/${removedStr}`;
    }
}
//# sourceMappingURL=lines-widget.js.map