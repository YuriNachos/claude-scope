/**
 * Balanced style renderer for PokerWidget
 * Output: "Hand: (K♠) A♠ | Board: 2♠ 3♠ 4♠ 5♠ 6♠ → Straight Flush! 🃏"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { PokerRenderData } from "./types.js";
export declare class PokerBalancedRenderer extends BaseStyleRenderer<PokerRenderData> {
    render(data: PokerRenderData): string;
    private formatCardByParticipation;
    private formatHandResult;
}
//# sourceMappingURL=balanced.d.ts.map