/**
 * Cache metrics widget styles
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { formatK } from "../../ui/utils/formatters.js";
import type { CacheMetricsRenderData, CacheMetricsStyle } from "./types.js";

/**
 * Format as USD currency
 * Shows <$0.01 for very small amounts, otherwise standard format
 */
function formatCurrency(usd: number): string {
  if (usd < 0.005 && usd > 0) {
    return "<$0.01";
  }
  return `$${usd.toFixed(2)}`;
}

/**
 * Create a progress bar with █ and ░ characters
 * @param percentage - Percentage (0-100)
 * @param width - Total width of the bar in characters
 */
function createProgressBar(percentage: number, width: number): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

/**
 * Get the appropriate color based on cache hit rate percentage
 */
function getCacheColor(hitRate: number, colors: IThemeColors): string {
  if (hitRate > 70) {
    return colors.cache.high;
  } else if (hitRate >= 40) {
    return colors.cache.medium;
  } else {
    return colors.cache.low;
  }
}

/**
 * Style implementations for cache metrics display
 */
export const cacheMetricsStyles: StyleMap<CacheMetricsRenderData, IThemeColors> = {
  /**
   * balanced: 💾 70% cached (35.0k tokens) with color coding
   */
  balanced: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { hitRate, cacheRead } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const percentage = color ? `${color}${hitRate.toFixed(0)}%` : `${hitRate.toFixed(0)}%`;
    const tokens = colors
      ? `${colors.cache.read}${formatK(cacheRead)} tokens`
      : `${formatK(cacheRead)} tokens`;
    return `💾 ${percentage} cached (${tokens})`;
  },

  /**
   * compact: Cache: 70%
   */
  compact: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const hitRate = data.hitRate.toFixed(0);
    if (colors) {
      return `${colors.cache.read}Cache: ${hitRate}%`;
    }
    return `Cache: ${hitRate}%`;
  },

  /**
   * playful: 💾 [███████░] 70% with progress bar
   */
  playful: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { hitRate } = data;
    const bar = createProgressBar(hitRate, 7);
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const barAndPercent = color
      ? `${color}[${bar}] ${hitRate.toFixed(0)}%`
      : `[${bar}] ${hitRate.toFixed(0)}%`;
    return `💾 ${barAndPercent}`;
  },

  /**
   * verbose: Cache: 35.0k tokens (70%) | $0.03 saved
   */
  verbose: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, hitRate, savings } = data;
    const tokens = colors
      ? `${colors.cache.read}${formatK(cacheRead)} tokens`
      : `${formatK(cacheRead)} tokens`;
    const percent = `${hitRate.toFixed(0)}%`;
    const saved = colors
      ? `${colors.cache.write}${formatCurrency(savings)} saved`
      : `${formatCurrency(savings)} saved`;
    return `Cache: ${tokens} (${percent}) | ${saved}`;
  },

  /**
   * labeled: Cache Hit: 70% | $0.03 saved
   */
  labeled: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { hitRate, savings } = data;
    const percent = colors
      ? `${colors.cache.read}${hitRate.toFixed(0)}%`
      : `${hitRate.toFixed(0)}%`;
    const saved = colors
      ? `${colors.cache.write}${formatCurrency(savings)} saved`
      : `${formatCurrency(savings)} saved`;
    return `Cache Hit: ${percent} | ${saved}`;
  },

  /**
   * indicator: ● 70% cached
   */
  indicator: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { hitRate } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const percentage = color ? `${color}${hitRate.toFixed(0)}%` : `${hitRate.toFixed(0)}%`;
    return `● ${percentage} cached`;
  },

  /**
   * breakdown: Multi-line with ├─ Read: and └─ Write: breakdown
   */
  breakdown: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, cacheWrite, hitRate, savings } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const percent = color ? `${color}${hitRate.toFixed(0)}%` : `${hitRate.toFixed(0)}%`;
    const saved = colors
      ? `${colors.cache.write}${formatCurrency(savings)} saved`
      : `${formatCurrency(savings)} saved`;
    const read = colors ? `${colors.cache.read}${formatK(cacheRead)}` : formatK(cacheRead);
    const write = colors ? `${colors.cache.write}${formatK(cacheWrite)}` : formatK(cacheWrite);

    return [`💾 ${percent} cached | ${saved}`, `├─ Read: ${read}`, `└─ Write: ${write}`].join("\n");
  },
};

/**
 * Get the default style for cache metrics
 */
export function getDefaultCacheMetricsStyle(): CacheMetricsStyle {
  return "balanced";
}

/**
 * Get all available cache metrics styles
 */
export function getCacheMetricsStyles(): CacheMetricsStyle[] {
  return ["balanced", "compact", "playful", "verbose", "labeled", "indicator", "breakdown"];
}

/**
 * Validate if a string is a valid cache metrics style
 */
export function isValidCacheMetricsStyle(style: string): style is CacheMetricsStyle {
  return getCacheMetricsStyles().includes(style as CacheMetricsStyle);
}
