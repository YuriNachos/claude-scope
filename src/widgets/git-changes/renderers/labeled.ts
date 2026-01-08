/**
 * Labeled style renderer for GitChangesWidget
 * Output: "Diff: +142 -27"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { withLabel } from "../../../ui/utils/style-utils.js";
import type { GitChangesRenderData } from "./types.js";

export class GitChangesLabeledRenderer extends BaseStyleRenderer<GitChangesRenderData> {
  render(data: GitChangesRenderData): string {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions}`);
    if (data.deletions > 0) parts.push(`-${data.deletions}`);
    const changes = parts.join(" ");
    return withLabel("Diff", changes);
  }
}
