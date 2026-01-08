/**
 * Compact style renderer for GitTagWidget
 * Output: "0.5.4" or "—" (removes "v" prefix)
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { GitTagRenderData } from "./types.js";

export class GitTagCompactRenderer extends BaseStyleRenderer<GitTagRenderData> {
  render(data: GitTagRenderData): string {
    if (!data.tag) return "—";
    // Remove "v" prefix if present
    return data.tag.replace(/^v/, "");
  }
}
