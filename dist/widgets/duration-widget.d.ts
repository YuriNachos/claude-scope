/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class DurationWidget extends StdinDataWidget {
    readonly id = "duration";
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
//# sourceMappingURL=duration-widget.d.ts.map