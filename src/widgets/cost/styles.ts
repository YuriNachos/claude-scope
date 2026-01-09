/**
 * Functional style renderers for CostWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { ICostColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { formatCostUSD } from "../../ui/utils/formatters.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { CostRenderData } from "./types.js";

export const costStyles: StyleMap<CostRenderData, ICostColors> = {
  balanced: (data: CostRenderData, colors?: ICostColors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return formatted;

    // Colorize the amount, keep currency symbol muted
    const amountStr = data.costUsd.toFixed(2);
    return colorize("$", colors.currency) + colorize(amountStr, colors.amount);
  },

  compact: (data: CostRenderData, colors?: ICostColors) => {
    return costStyles.balanced(data, colors);
  },

  playful: (data: CostRenderData, colors?: ICostColors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return `💰 ${formatted}`;

    const amountStr = data.costUsd.toFixed(2);
    const colored = colorize("$", colors.currency) + colorize(amountStr, colors.amount);
    return `💰 ${colored}`;
  },

  labeled: (data: CostRenderData, colors?: ICostColors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return withLabel("Cost", formatted);

    const amountStr = data.costUsd.toFixed(2);
    const colored = colorize("$", colors.currency) + colorize(amountStr, colors.amount);
    return withLabel("Cost", colored);
  },

  indicator: (data: CostRenderData, colors?: ICostColors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return withIndicator(formatted);

    const amountStr = data.costUsd.toFixed(2);
    const colored = colorize("$", colors.currency) + colorize(amountStr, colors.amount);
    return withIndicator(colored);
  },
};
