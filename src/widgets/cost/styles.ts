/**
 * Functional style renderers for CostWidget
 */

import { formatCostUSD } from "../../ui/utils/formatters.js";
import { withLabel, withIndicator, withFancy } from "../../ui/utils/style-utils.js";
import type { CostRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

export const costStyles: StyleMap<CostRenderData> = {
  balanced: (data: CostRenderData) => {
    return formatCostUSD(data.costUsd);
  },

  compact: (data: CostRenderData) => {
    return formatCostUSD(data.costUsd);
  },

  playful: (data: CostRenderData) => {
    return `💰 ${formatCostUSD(data.costUsd)}`;
  },

  labeled: (data: CostRenderData) => {
    return withLabel("Cost", formatCostUSD(data.costUsd));
  },

  indicator: (data: CostRenderData) => {
    return withIndicator(formatCostUSD(data.costUsd));
  },

  fancy: (data: CostRenderData) => {
    return withFancy(formatCostUSD(data.costUsd));
  },
};
