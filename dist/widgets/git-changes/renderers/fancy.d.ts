/**
 * Fancy style renderer for GitChangesWidget
 * Output: "⟨+142|-27⟩"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitChangesRenderData } from "./types.js";
export declare class GitChangesFancyRenderer extends BaseStyleRenderer<GitChangesRenderData> {
    render(data: GitChangesRenderData): string;
}
//# sourceMappingURL=fancy.d.ts.map