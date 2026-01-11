/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
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
    private _lineOverride?;
    private styleFn;
    constructor(colors?: IThemeColors);
    setStyle(style?: WidgetStyle): void;
    setLine(line: number): void;
    getLine(): number;
    protected renderWithData(data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=lines-widget.d.ts.map