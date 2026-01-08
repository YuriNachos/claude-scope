/**
 * Indicator style renderer for DurationWidget
 * Output: "● 1h 1m 5s"
 */

import { formatDuration } from "../../../ui/utils/formatters.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { DurationRenderData } from "./types.js";

export class DurationIndicatorRenderer extends BaseStyleRenderer<DurationRenderData> {
  render(data: DurationRenderData): string {
    return withIndicator(formatDuration(data.durationMs));
  }
}
