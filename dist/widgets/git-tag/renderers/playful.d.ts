/**
 * Playful style renderer for GitTagWidget
 * Output: "🏷️ v0.5.4" or "🏷️ —"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitTagRenderData } from "./types.js";
export declare class GitTagPlayfulRenderer extends BaseStyleRenderer<GitTagRenderData> {
    render(data: GitTagRenderData): string;
}
//# sourceMappingURL=playful.d.ts.map