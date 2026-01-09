/**
 * Storage types for cache persistence
 */
/** Cached context usage data */
export interface CachedContextUsage {
    /** Timestamp when cached (ms since epoch) */
    timestamp: number;
    /** Context usage data */
    usage: {
        input_tokens: number;
        output_tokens: number;
        cache_creation_input_tokens: number;
        cache_read_input_tokens: number;
    };
}
/** Cache file structure */
export interface CacheFile {
    /** Per-session cached data, keyed by session_id */
    sessions: Record<string, CachedContextUsage>;
    /** Cache version for migration */
    version: 1;
}
/** Cache manager options */
export interface CacheManagerOptions {
    /** Cache file path */
    cachePath: string;
    /** Cache expiry time in milliseconds (default: 5 minutes) */
    expiryMs?: number;
}
//# sourceMappingURL=types.d.ts.map