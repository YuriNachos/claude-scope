/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class PokerWidget extends StdinDataWidget {
    readonly id = "poker";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private holeCards;
    private boardCards;
    private handResult;
    private lastUpdateTimestamp;
    private readonly THROTTLE_MS;
    private colors;
    private _lineOverride?;
    private styleFn;
    setStyle(style?: WidgetStyle): void;
    setLine(line: number): void;
    getLine(): number;
    constructor(colors?: IThemeColors);
    /**
     * Generate new poker hand on each update
     */
    update(data: StdinData): Promise<void>;
    /**
     * Format card with appropriate color (red for ♥♦, gray for ♠♣)
     */
    private formatCardColor;
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
    private getHandName;
    private getHandEmoji;
}
//# sourceMappingURL=poker-widget.d.ts.map