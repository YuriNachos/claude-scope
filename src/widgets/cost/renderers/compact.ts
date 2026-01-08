/**
 * Compact style renderer for CostWidget
 * Output: "$0.42" (same as balanced for cost)
 */

import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { CostRenderData } from "./types.js";

export class CostCompactRenderer extends BaseStyleRenderer<CostRenderData> {
  render(data: CostRenderData): string {
    return formatCostUSD(data.costUsd);
  }
}
