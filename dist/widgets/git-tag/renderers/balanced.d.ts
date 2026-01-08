/**
 * Balanced style renderer for GitTagWidget
 * Output: "v0.5.4" or "—"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitTagRenderData } from "./types.js";
export declare class GitTagBalancedRenderer extends BaseStyleRenderer<GitTagRenderData> {
    render(data: GitTagRenderData): string;
}
//# sourceMappingURL=balanced.d.ts.map