/**
 * Labeled style renderer for LinesWidget
 * Output: "Lines: +142/-27" (with colors)
 */
import type { ILinesColors } from "../../../ui/theme/types.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { LinesRenderData } from "./types.js";
export declare class LinesLabeledRenderer extends BaseStyleRenderer<LinesRenderData> {
    private colors;
    constructor(colors: ILinesColors);
    render(data: LinesRenderData): string;
}
//# sourceMappingURL=labeled.d.ts.map