/**
 * Cache metrics widget styles
 */
import type { StyleMap } from "../../core/style-types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import type { CacheMetricsRenderData, CacheMetricsStyle } from "./types.js";
/**
 * Style implementations for cache metrics display
 */
export declare const cacheMetricsStyles: StyleMap<CacheMetricsRenderData, IThemeColors>;
/**
 * Get the default style for cache metrics
 */
export declare function getDefaultCacheMetricsStyle(): CacheMetricsStyle;
/**
 * Get all available cache metrics styles
 */
export declare function getCacheMetricsStyles(): CacheMetricsStyle[];
/**
 * Validate if a string is a valid cache metrics style
 */
export declare function isValidCacheMetricsStyle(style: string): style is CacheMetricsStyle;
//# sourceMappingURL=styles.d.ts.map