/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 * Uses cached values when current_usage is null to prevent flickering
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class ContextWidget extends StdinDataWidget {
    readonly id = "context";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private colors;
    private _lineOverride?;
    private styleFn;
    private cacheManager;
    private lastSessionId?;
    constructor(colors?: IThemeColors);
    setStyle(style?: WidgetStyle): void;
    setLine(line: number): void;
    getLine(): number;
    /**
     * Update widget with new data, storing valid values in cache
     */
    update(data: StdinData): Promise<void>;
    protected renderWithData(data: StdinData, _context: RenderContext): string | null;
    isEnabled(): boolean;
}
//# sourceMappingURL=context-widget.d.ts.map