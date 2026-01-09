/**
 * Cache metrics widget styles
 */

import type { StyleMap } from "../../core/style-types.js";
import type { CacheMetricsRenderData, CacheMetricsStyle } from "./types.js";

/**
 * Format number with K suffix for thousands
 * Examples: 500 -> "500", 1500 -> "1.5k", 1000000 -> "1000k"
 */
function formatK(n: number): string {
  if (n < 1000) {
    return n.toString();
  }
  const k = n / 1000;
  // Show up to 1 decimal place for values under 10k
  return k < 10 ? `${k.toFixed(1)}k` : `${Math.round(k)}k`;
}

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
 * Style implementations for cache metrics display
 */
export const cacheMetricsStyles: StyleMap<CacheMetricsRenderData> = {
  /**
   * balanced: 💾 70% cached (35.0k tokens) with color coding
   */
  balanced: (data: CacheMetricsRenderData) => {
    const { hitRate, cacheRead } = data;
    return `💾 ${hitRate.toFixed(0)}% cached (${formatK(cacheRead)} tokens)`;
  },

  /**
   * compact: Cache: 70%
   */
  compact: (data: CacheMetricsRenderData) => {
    return `Cache: ${data.hitRate.toFixed(0)}%`;
  },

  /**
   * playful: 💾 [███████░] 70% with progress bar
   */
  playful: (data: CacheMetricsRenderData) => {
    const { hitRate } = data;
    const bar = createProgressBar(hitRate, 7);
    return `💾 [${bar}] ${hitRate.toFixed(0)}%`;
  },

  /**
   * verbose: Cache: 35.0k tokens (70%) | $0.03 saved
   */
  verbose: (data: CacheMetricsRenderData) => {
    const { cacheRead, hitRate, savings } = data;
    return `Cache: ${formatK(cacheRead)} tokens (${hitRate.toFixed(0)}%) | ${formatCurrency(savings)} saved`;
  },

  /**
   * labeled: Cache Hit: 70% | $0.03 saved
   */
  labeled: (data: CacheMetricsRenderData) => {
    const { hitRate, savings } = data;
    return `Cache Hit: ${hitRate.toFixed(0)}% | ${formatCurrency(savings)} saved`;
  },

  /**
   * indicator: ● 70% cached
   */
  indicator: (data: CacheMetricsRenderData) => {
    return `● ${data.hitRate.toFixed(0)}% cached`;
  },

  /**
   * breakdown: Multi-line with ├─ Read: and └─ Write: breakdown
   */
  breakdown: (data: CacheMetricsRenderData) => {
    const { cacheRead, cacheWrite, hitRate, savings } = data;
    return [
      `💾 ${hitRate.toFixed(0)}% cached | ${formatCurrency(savings)} saved`,
      `├─ Read: ${formatK(cacheRead)}`,
      `└─ Write: ${formatK(cacheWrite)}`,
    ].join("\n");
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
