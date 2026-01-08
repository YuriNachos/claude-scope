/**
 * Labeled style renderer for CostWidget
 * Output: "Cost: $0.42"
 */

import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { CostRenderData } from "./types.js";

export class CostLabeledRenderer extends BaseStyleRenderer<CostRenderData> {
  render(data: CostRenderData): string {
    return `Cost: ${formatCostUSD(data.costUsd)}`;
  }
}
