/**
 * Verbose style renderer for GitChangesWidget
 * Output: "+142 insertions, -27 deletions"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitChangesRenderData } from "./types.js";
export declare class GitChangesVerboseRenderer extends BaseStyleRenderer<GitChangesRenderData> {
    render(data: GitChangesRenderData): string;
}
//# sourceMappingURL=verbose.d.ts.map