/**
 * Duration Widget
 *
 * Displays elapsed session time
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { durationStyles } from "./duration/styles.js";
import type { DurationRenderData } from "./duration/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

export class DurationWidget extends StdinDataWidget {
  readonly id = "duration";
  readonly metadata = createWidgetMetadata(
    "Duration",
    "Displays elapsed session time",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private styleFn: StyleRendererFn<DurationRenderData> = durationStyles.balanced!;

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = durationStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    if (!data.cost || data.cost.total_duration_ms === undefined) return null;

    const renderData: DurationRenderData = {
      durationMs: data.cost.total_duration_ms,
    };

    return this.styleFn(renderData);
  }
}
