/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import type { ILinesColors } from '../ui/theme/types.js';
import type { RenderContext, StdinData } from '../types.js';
/**
 * Widget displaying lines added/removed in session
 *
 * Shows colored "+N" for lines added and "-N" for lines removed.
 * Defaults to "+0/-0" when cost data is unavailable.
 */
export declare class LinesWidget extends StdinDataWidget {
    readonly id = "lines";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private colors;
    constructor(colors?: ILinesColors);
    protected renderWithData(data: StdinData, context: RenderContext): string | null;
}
//# sourceMappingURL=lines-widget.d.ts.map