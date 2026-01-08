/**
 * Indicator style renderer for GitWidget
 * Output: "● main"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
import type { GitRenderData } from "./types.js";

export class GitIndicatorRenderer extends BaseStyleRenderer<GitRenderData> {
  render(data: GitRenderData): string {
    return withIndicator(data.branch);
  }
}
