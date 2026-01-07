/**
 * Poker Widget
 *
 * Displays random Texas Hold'em hands for entertainment
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import type { RenderContext, StdinData } from '../types.js';
export declare class PokerWidget extends StdinDataWidget {
    readonly id = "poker";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private deck;
    private holeCards;
    private boardCards;
    private handResult;
    constructor();
    /**
     * Generate new poker hand on each update
     */
    update(data: StdinData): Promise<void>;
    /**
     * Format card with appropriate color (red for ♥♦, gray for ♠♣)
     */
    private formatCardColor;
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=poker-widget.d.ts.map