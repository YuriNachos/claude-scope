/**
 * Labeled style renderer for DurationWidget
 * Output: "Time: 1h 1m 5s"
 */

import { formatDuration } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { DurationRenderData } from "./types.js";

export class DurationLabeledRenderer extends BaseStyleRenderer<DurationRenderData> {
  render(data: DurationRenderData): string {
    return `Time: ${formatDuration(data.durationMs)}`;
  }
}
