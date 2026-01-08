/**
 * Cost Widget
 *
 * Displays total session cost
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { ICostColors, IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { costStyles } from "./cost/styles.js";
import type { CostRenderData } from "./cost/types.js";

export class CostWidget extends StdinDataWidget {
  readonly id = "cost";
  readonly metadata = createWidgetMetadata(
    "Cost",
    "Displays session cost in USD",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private colors: IThemeColors;
  private styleFn: StyleRendererFn<CostRenderData, ICostColors> = costStyles.balanced!;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = costStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    if (!data.cost || data.cost.total_cost_usd === undefined) return null;

    const renderData: CostRenderData = {
      costUsd: data.cost.total_cost_usd,
    };

    return this.styleFn(renderData, this.colors.cost);
  }
}
