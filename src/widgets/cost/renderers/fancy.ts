/**
 * Fancy style renderer for CostWidget
 * Output: "«$0.42»"
 */

import { formatCostUSD } from "../../../ui/utils/formatters.js";
import { withFancy } from "../../../ui/utils/style-utils.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { CostRenderData } from "./types.js";

export class CostFancyRenderer extends BaseStyleRenderer<CostRenderData> {
  render(data: CostRenderData): string {
    return withFancy(formatCostUSD(data.costUsd));
  }
}
