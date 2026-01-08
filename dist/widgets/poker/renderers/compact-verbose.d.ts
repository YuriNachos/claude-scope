/**
 * Compact-Verbose style renderer for PokerWidget
 * Output: "(K♠)A♠ | 2♠3♠4♠5♠6♠ → SF (Straight Flush)"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { PokerRenderData } from "./types.js";
export declare class PokerCompactVerboseRenderer extends BaseStyleRenderer<PokerRenderData> {
    render(data: PokerRenderData): string;
    private formatCardCompact;
    private formatCardText;
    private getHandAbbreviation;
}
//# sourceMappingURL=compact-verbose.d.ts.map