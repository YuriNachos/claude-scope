/**
 * Labeled style renderer for GitTagWidget
 * Output: "Tag: v0.5.4" or "Tag: none"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitTagRenderData } from "./types.js";
export declare class GitTagLabeledRenderer extends BaseStyleRenderer<GitTagRenderData> {
    render(data: GitTagRenderData): string;
}
//# sourceMappingURL=labeled.d.ts.map