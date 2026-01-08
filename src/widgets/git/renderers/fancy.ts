/**
 * Fancy style renderer for GitWidget
 * Output: "[main]"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withBrackets } from "../../../ui/utils/style-utils.js";
import type { GitRenderData } from "./types.js";

export class GitFancyRenderer extends BaseStyleRenderer<GitRenderData> {
  render(data: GitRenderData): string {
    return withBrackets(data.branch);
  }
}
