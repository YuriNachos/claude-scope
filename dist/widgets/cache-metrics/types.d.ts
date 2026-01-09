/**
 * Cache metrics widget types
 */
/**
 * Render data for cache metrics display
 */
export interface CacheMetricsRenderData {
    cacheRead: number;
    cacheWrite: number;
    totalTokens: number;
    hitRate: number;
    savings: number;
}
/**
 * Display style for cache metrics widget
 */
export type CacheMetricsStyle = "balanced" | "compact" | "playful" | "verbose" | "labeled" | "indicator" | "breakdown";
//# sourceMappingURL=types.d.ts.map