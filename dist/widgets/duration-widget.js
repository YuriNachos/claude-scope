/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { formatDuration } from '../ui/utils/formatters.js';
export class DurationWidget extends StdinDataWidget {
    id = 'duration';
    metadata = createWidgetMetadata('Duration', 'Displays elapsed session time');
    renderWithData(data, context) {
        if (!data.cost || data.cost.total_duration_ms === undefined)
            return null;
        return formatDuration(data.cost.total_duration_ms);
    }
}
//# sourceMappingURL=duration-widget.js.map