/**
 * Cache metrics widget types
 */

/**
 * Render data for cache metrics display
 */
export interface CacheMetricsRenderData {
  cacheRead: number; // Cache read tokens
  cacheWrite: number; // Cache write tokens
  totalTokens: number; // Total tokens in context
  hitRate: number; // Cache hit rate (0-100)
  savings: number; // Estimated cost savings in USD
}

/**
 * Display style for cache metrics widget
 */
export type CacheMetricsStyle =
  | "balanced"
  | "compact"
  | "playful"
  | "verbose"
  | "labeled"
  | "indicator"
  | "breakdown";
