/**
 * Playful style renderer for CostWidget
 * Output: "💰 $0.42"
 */

import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { CostRenderData } from "./types.js";

export class CostPlayfulRenderer extends BaseStyleRenderer<CostRenderData> {
  render(data: CostRenderData): string {
    return `💰 ${formatCostUSD(data.costUsd)}`;
  }
}
