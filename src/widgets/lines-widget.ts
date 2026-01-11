/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { ILinesColors, IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { linesStyles } from "./lines/styles.js";
import type { LinesRenderData } from "./lines/types.js";

/**
 * Widget displaying lines added/removed in session
 *
 * Shows colored "+N" for lines added and "-N" for lines removed.
 * Defaults to "+0/-0" when cost data is unavailable.
 */
export class LinesWidget extends StdinDataWidget {
  readonly id = "lines";
  readonly metadata = createWidgetMetadata(
    "Lines",
    "Displays lines added/removed in session",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private colors: IThemeColors;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<LinesRenderData, ILinesColors> = linesStyles.balanced!;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = linesStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;

    const renderData: LinesRenderData = { added, removed };
    return this.styleFn(renderData, this.colors.lines);
  }
}
