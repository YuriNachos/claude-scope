/**
 * Fancy style renderer for GitTagWidget
 * Output: "⟨v0.5.4⟩" or "⟨—⟩"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withAngleBrackets } from "../../../ui/utils/style-utils.js";
import type { GitTagRenderData } from "./types.js";

export class GitTagFancyRenderer extends BaseStyleRenderer<GitTagRenderData> {
  render(data: GitTagRenderData): string {
    return withAngleBrackets(data.tag || "—");
  }
}
