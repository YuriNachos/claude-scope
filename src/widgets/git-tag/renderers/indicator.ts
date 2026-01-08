/**
 * Indicator style renderer for GitTagWidget
 * Output: "● v0.5.4" or "● —"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
import type { GitTagRenderData } from "./types.js";

export class GitTagIndicatorRenderer extends BaseStyleRenderer<GitTagRenderData> {
  render(data: GitTagRenderData): string {
    return withIndicator(data.tag || "—");
  }
}
