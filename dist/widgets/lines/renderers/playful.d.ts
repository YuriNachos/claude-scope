/**
 * Playful style renderer for LinesWidget
 * Output: "➕142 ➖27" (with colors: + in green, - in red)
 */
import type { ILinesColors } from "../../../ui/theme/types.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { LinesRenderData } from "./types.js";
export declare class LinesPlayfulRenderer extends BaseStyleRenderer<LinesRenderData> {
    private colors;
    constructor(colors: ILinesColors);
    render(data: LinesRenderData): string;
}
//# sourceMappingURL=playful.d.ts.map