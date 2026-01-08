/**
 * Compact style renderer for DurationWidget
 * Output: "1h1m" (hours and minutes only)
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { DurationRenderData } from "./types.js";
export declare class DurationCompactRenderer extends BaseStyleRenderer<DurationRenderData> {
    render(data: DurationRenderData): string;
}
//# sourceMappingURL=compact.d.ts.map