/**
 * Playful style renderer for GitWidget
 * Output: "🔀 main"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitRenderData } from "./types.js";

export class GitPlayfulRenderer extends BaseStyleRenderer<GitRenderData> {
  render(data: GitRenderData): string {
    return `🔀 ${data.branch}`;
  }
}
