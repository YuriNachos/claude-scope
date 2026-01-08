/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */

import { StdinDataWidget } from "./core/stdin-data-widget.js";
import type { WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import { colorize } from "../ui/utils/formatters.js";
import type { ILinesColors } from "../ui/theme/types.js";
import { DEFAULT_THEME } from "../ui/theme/default-theme.js";
import type { RenderContext, StdinData } from "../types.js";
import { LinesBalancedRenderer } from "./lines/renderers/balanced.js";
import { LinesCompactRenderer } from "./lines/renderers/compact.js";
import { LinesFancyRenderer } from "./lines/renderers/fancy.js";
import { LinesIndicatorRenderer } from "./lines/renderers/indicator.js";
import { LinesLabeledRenderer } from "./lines/renderers/labeled.js";
import { LinesPlayfulRenderer } from "./lines/renderers/playful.js";
import { LinesVerboseRenderer } from "./lines/renderers/verbose.js";
import type { LinesRenderer } from "./lines/renderers/types.js";

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
  private renderer: LinesRenderer;

  constructor(colors?: ILinesColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.lines!;
    this.renderer = new LinesBalancedRenderer(this.colors);
  }

  setStyle(style: WidgetStyle): void {
    switch (style) {
      case "balanced":
        this.renderer = new LinesBalancedRenderer(this.colors);
        break;
      case "compact":
        this.renderer = new LinesCompactRenderer(this.colors);
        break;
      case "playful":
        this.renderer = new LinesPlayfulRenderer(this.colors);
        break;
      case "verbose":
        this.renderer = new LinesVerboseRenderer(this.colors);
        break;
      case "labeled":
        this.renderer = new LinesLabeledRenderer(this.colors);
        break;
      case "indicator":
        this.renderer = new LinesIndicatorRenderer(this.colors);
        break;
      case "fancy":
        this.renderer = new LinesFancyRenderer(this.colors);
        break;
      default:
        this.renderer = new LinesBalancedRenderer(this.colors);
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;

    const renderData = { added, removed };
    return this.renderer.render(renderData);
  }
}
