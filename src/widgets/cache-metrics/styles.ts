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
   * balanced: 💾 35.0k cache with color coding
   */
  balanced: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, hitRate } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const amount = color ? `${color}${formatK(cacheRead)} cache` : `${formatK(cacheRead)} cache`;
    return `💾 ${amount}`;
  },

  /**
   * compact: Cache: 35.0k
   */
  compact: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead } = data;
    const amount = formatK(cacheRead);
    if (colors) {
      return `${colors.cache.read}Cache: ${amount}`;
    }
    return `Cache: ${amount}`;
  },

  /**
   * playful: 💾 35.0k cache
   */
  playful: (data: CacheMetricsRenderData, _colors?: IThemeColors) => {
    const { cacheRead } = data;
    const amount = formatK(cacheRead);
    return `💾 ${amount} cache`;
  },

  /**
   * verbose: Cache: 35.0k | $0.03 saved
   */
  verbose: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, savings } = data;
    const amount = formatK(cacheRead);
    const saved = colors
      ? `${colors.cache.write}${formatCurrency(savings)} saved`
      : `${formatCurrency(savings)} saved`;
    return `Cache: ${amount} | ${saved}`;
  },

  /**
   * labeled: Cache: 35.0k | $0.03 saved
   */
  labeled: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, savings } = data;
    const amount = formatK(cacheRead);
    const saved = colors
      ? `${colors.cache.write}${formatCurrency(savings)} saved`
      : `${formatCurrency(savings)} saved`;
    return `Cache: ${amount} | ${saved}`;
  },

  /**
   * indicator: ● 35.0k cache with color coding
   */
  indicator: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, hitRate } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const amount = color ? `${color}${formatK(cacheRead)} cache` : `${formatK(cacheRead)} cache`;
    return `● ${amount}`;
  },

  /**
   * breakdown: Single-line with Hit: and Write: breakdown
   */
  breakdown: (data: CacheMetricsRenderData, colors?: IThemeColors) => {
    const { cacheRead, cacheWrite, savings } = data;
    const amount = formatK(cacheRead);
    const saved = colors
      ? `${colors.cache.write}${formatCurrency(savings)} saved`
      : `${formatCurrency(savings)} saved`;
    const read = formatK(cacheRead);
    const write = formatK(cacheWrite);

    return `💾 ${amount} cache | Hit: ${read}, Write: ${write} | ${saved}`;
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
