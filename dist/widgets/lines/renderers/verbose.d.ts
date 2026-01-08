/**
 * Verbose style renderer for LinesWidget
 * Output: "+142 added, -27 removed" (with colors)
 */
import type { ILinesColors } from "../../../ui/theme/types.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { LinesRenderData } from "./types.js";
export declare class LinesVerboseRenderer extends BaseStyleRenderer<LinesRenderData> {
    private colors;
    constructor(colors: ILinesColors);
    render(data: LinesRenderData): string;
}
//# sourceMappingURL=verbose.d.ts.map