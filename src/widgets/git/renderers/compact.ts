/**
 * Compact style renderer for GitWidget
 * Output: "main" (same as balanced for branch)
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitRenderData } from "./types.js";

export class GitCompactRenderer extends BaseStyleRenderer<GitRenderData> {
  render(data: GitRenderData): string {
    return data.branch;
  }
}
