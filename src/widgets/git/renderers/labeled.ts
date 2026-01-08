/**
 * Labeled style renderer for GitWidget
 * Output: "Git: main"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withLabel } from "../../../ui/utils/style-utils.js";
import type { GitRenderData } from "./types.js";

export class GitLabeledRenderer extends BaseStyleRenderer<GitRenderData> {
  render(data: GitRenderData): string {
    return withLabel("Git", data.branch);
  }
}
