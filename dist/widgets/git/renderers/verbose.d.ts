/**
 * Verbose style renderer for GitWidget
 * Output: "branch: main (HEAD)"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitRenderData } from "./types.js";
export declare class GitVerboseRenderer extends BaseStyleRenderer<GitRenderData> {
    render(data: GitRenderData): string;
}
//# sourceMappingURL=verbose.d.ts.map