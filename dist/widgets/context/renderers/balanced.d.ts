/**
 * Balanced style renderer for ContextWidget
 *
 * Output format: `[████░░░] 71%`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ContextRenderData } from "./types.js";
export declare class ContextBalancedRenderer extends BaseStyleRenderer<ContextRenderData> {
    render(data: ContextRenderData): string;
}
//# sourceMappingURL=balanced.d.ts.map