/**
 * Verbose style renderer for GitTagWidget
 * Output: "version v0.5.4" or "version: none"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitTagRenderData } from "./types.js";
export declare class GitTagVerboseRenderer extends BaseStyleRenderer<GitTagRenderData> {
    render(data: GitTagRenderData): string;
}
//# sourceMappingURL=verbose.d.ts.map