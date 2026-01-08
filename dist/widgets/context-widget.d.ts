/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class ContextWidget extends StdinDataWidget {
    readonly id = "context";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private colors;
    private styleFn;
    constructor(colors?: IThemeColors);
    setStyle(style?: WidgetStyle): void;
    protected renderWithData(data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=context-widget.d.ts.map