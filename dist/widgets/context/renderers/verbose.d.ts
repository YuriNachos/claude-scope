/**
 * Verbose style renderer for ContextWidget
 *
 * Output format: `142,847 / 200,000 tokens (71%)`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ContextRenderData } from "./types.js";
export declare class ContextVerboseRenderer extends BaseStyleRenderer<ContextRenderData> {
    render(data: ContextRenderData): string;
}
//# sourceMappingURL=verbose.d.ts.map