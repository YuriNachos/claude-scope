/**
 * Fancy style renderer for DurationWidget
 * Output: "⟨1h 1m 5s⟩"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { DurationRenderData } from "./types.js";
export declare class DurationFancyRenderer extends BaseStyleRenderer<DurationRenderData> {
    render(data: DurationRenderData): string;
}
//# sourceMappingURL=fancy.d.ts.map