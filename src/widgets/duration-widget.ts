/**
 * Duration Widget
 *
 * Displays elapsed session time
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IDurationColors, IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { durationStyles } from "./duration/styles.js";
import type { DurationRenderData } from "./duration/types.js";

export class DurationWidget extends StdinDataWidget {
  readonly id = "duration";
  readonly metadata = createWidgetMetadata(
    "Duration",
    "Displays elapsed session time",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private colors: IThemeColors;
  private styleFn: StyleRendererFn<DurationRenderData, IDurationColors> = durationStyles.balanced!;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

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

    return this.styleFn(renderData, this.colors.duration);
  }
}
