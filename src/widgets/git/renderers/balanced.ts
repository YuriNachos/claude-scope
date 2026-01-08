/**
 * Balanced style renderer for GitWidget
 * Output: "main"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitRenderData } from "./types.js";

export class GitBalancedRenderer extends BaseStyleRenderer<GitRenderData> {
  render(data: GitRenderData): string {
    return data.branch;
  }
}
