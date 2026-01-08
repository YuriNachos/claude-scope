/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */
import type { RenderContext, StdinData } from "../types.js";
import type { WidgetStyle } from "../core/style-types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class PokerWidget extends StdinDataWidget {
    readonly id = "poker";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private holeCards;
    private boardCards;
    private handResult;
    private lastUpdateTimestamp;
    private readonly THROTTLE_MS;
    private renderer;
    /**
     * Generate new poker hand on each update
     */
    update(data: StdinData): Promise<void>;
    setStyle(style?: WidgetStyle): void;
    /**
     * Format card with appropriate color (red for ♥♦, gray for ♠♣)
     */
    private formatCardColor;
    /**
     * Format card based on participation in best hand
     * Participating cards: (K♠) with color + BOLD
     * Non-participating cards: K♠ with color, no brackets
     */
    private formatCardByParticipation;
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
    private getHandName;
    private getHandEmoji;
}
//# sourceMappingURL=poker-widget.d.ts.map