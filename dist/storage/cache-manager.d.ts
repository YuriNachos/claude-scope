/**
 * Cache Manager for persisting widget state
 *
 * Stores last valid context_usage values to prevent flickering
 * when Claude Code sends null current_usage during tool execution.
 *
 * IMPORTANT: Widgets should only cache data when there are meaningful
 * (non-zero) token values. This prevents zero-value state from overwriting
 * valid cache data, which would cause widgets to incorrectly display zeros
 * when falling back to cache during tool execution.
 *
 * Cache entries are session-specific and expire after 5 minutes by default.
 */
import type { CachedContextUsage, CacheManagerOptions } from "./types.js";
export declare class CacheManager {
    private cachePath;
    private expiryMs;
    constructor(options?: Partial<CacheManagerOptions>);
    /**
     * Get cached usage data for a session
     * @param sessionId - Session identifier
     * @returns Cached usage if valid and not expired, null otherwise
     */
    getCachedUsage(sessionId: string): CachedContextUsage | null;
    /**
     * Store usage data for a session
     * @param sessionId - Session identifier
     * @param usage - Context usage data to cache
     */
    setCachedUsage(sessionId: string, usage: CachedContextUsage["usage"]): void;
    /**
     * Clear all cached data (useful for testing)
     */
    clearCache(): void;
    /**
     * Clean up expired sessions
     */
    cleanupExpired(): void;
    /**
     * Load cache from file
     */
    private loadCache;
    /**
     * Save cache to file
     */
    private saveCache;
    /**
     * Ensure cache directory exists
     */
    private ensureCacheDir;
}
//# sourceMappingURL=cache-manager.d.ts.map