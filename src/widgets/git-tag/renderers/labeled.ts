/**
 * Labeled style renderer for GitTagWidget
 * Output: "Tag: v0.5.4" or "Tag: none"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withLabel } from "../../../ui/utils/style-utils.js";
import type { GitTagRenderData } from "./types.js";

export class GitTagLabeledRenderer extends BaseStyleRenderer<GitTagRenderData> {
  render(data: GitTagRenderData): string {
    return withLabel("Tag", data.tag || "none");
  }
}
