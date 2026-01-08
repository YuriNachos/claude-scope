/**
 * Verbose style renderer for GitChangesWidget
 * Output: "+142 insertions, -27 deletions"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitChangesRenderData } from "./types.js";

export class GitChangesVerboseRenderer extends BaseStyleRenderer<GitChangesRenderData> {
  render(data: GitChangesRenderData): string {
    const parts: string[] = [];
    if (data.insertions > 0) parts.push(`+${data.insertions} insertions`);
    if (data.deletions > 0) parts.push(`-${data.deletions} deletions`);
    return parts.join(", ");
  }
}
