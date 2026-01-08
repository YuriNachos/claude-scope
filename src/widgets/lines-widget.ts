/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */

import type { StyleRendererFn, StyleMap, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { ILinesColors } from "../ui/theme/types.js";
import { DEFAULT_THEME } from "../ui/theme/default-theme.js";
import type { RenderContext, StdinData } from "../types.js";
import { createLinesStyles } from "./lines/styles.js";
import type { LinesRenderData } from "./lines/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

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

  private colors: ILinesColors;
  private linesStyles: StyleMap<LinesRenderData>;
  private styleFn: StyleRendererFn<LinesRenderData>;

  constructor(colors?: ILinesColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.lines!;
    this.linesStyles = createLinesStyles(this.colors);
    this.styleFn = this.linesStyles.balanced!;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = this.linesStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;

    const renderData: LinesRenderData = { added, removed };
    return this.styleFn(renderData);
  }
}
