/**
 * Cost Widget
 *
 * Displays total session cost
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class CostWidget extends StdinDataWidget {
    readonly id = "cost";
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
//# sourceMappingURL=cost-widget.d.ts.map