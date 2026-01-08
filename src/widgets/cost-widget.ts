/**
 * Cost Widget
 *
 * Displays total session cost
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { costStyles } from "./cost/styles.js";
import type { CostRenderData } from "./cost/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

export class CostWidget extends StdinDataWidget {
  readonly id = "cost";
  readonly metadata = createWidgetMetadata(
    "Cost",
    "Displays session cost in USD",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private styleFn: StyleRendererFn<CostRenderData> = costStyles.balanced!;

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

    return this.styleFn(renderData);
  }
}
