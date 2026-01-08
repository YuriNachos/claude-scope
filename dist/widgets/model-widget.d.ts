/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class ModelWidget extends StdinDataWidget {
    readonly id = "model";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private colors;
    private styleFn;
    constructor(colors?: IThemeColors);
    setStyle(style?: WidgetStyle): void;
    protected renderWithData(data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=model-widget.d.ts.map