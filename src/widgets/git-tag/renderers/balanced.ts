/**
 * Balanced style renderer for GitTagWidget
 * Output: "v0.5.4" or "—"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitTagRenderData } from "./types.js";

export class GitTagBalancedRenderer extends BaseStyleRenderer<GitTagRenderData> {
  render(data: GitTagRenderData): string {
    return data.tag || "—";
  }
}
