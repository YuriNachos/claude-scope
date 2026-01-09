/**
 * Cache Manager for persisting widget state
 *
 * Stores last valid context_usage values to prevent flickering
 * when Claude Code sends null current_usage during tool execution.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname } from "node:path";
const DEFAULT_CACHE_PATH = `${homedir()}/.config/claude-scope/cache.json`;
const DEFAULT_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
export class CacheManager {
    cachePath;
    expiryMs;
    constructor(options) {
        this.cachePath = options?.cachePath ?? DEFAULT_CACHE_PATH;
        this.expiryMs = options?.expiryMs ?? DEFAULT_EXPIRY_MS;
        // Ensure cache directory exists
        this.ensureCacheDir();
    }
    /**
     * Get cached usage data for a session
     * @param sessionId - Session identifier
     * @returns Cached usage if valid and not expired, null otherwise
     */
    getCachedUsage(sessionId) {
        const cache = this.loadCache();
        const cached = cache.sessions[sessionId];
        if (!cached) {
            return null;
        }
        // Check expiry
        const age = Date.now() - cached.timestamp;
        if (age > this.expiryMs) {
            // Remove expired entry
            delete cache.sessions[sessionId];
            this.saveCache(cache);
            return null;
        }
        return cached;
    }
    /**
     * Store usage data for a session
     * @param sessionId - Session identifier
     * @param usage - Context usage data to cache
     */
    setCachedUsage(sessionId, usage) {
        const cache = this.loadCache();
        cache.sessions[sessionId] = {
            timestamp: Date.now(),
            usage,
        };
        this.saveCache(cache);
    }
    /**
     * Clear all cached data (useful for testing)
     */
    clearCache() {
        const emptyCache = {
            sessions: {},
            version: 1,
        };
        this.saveCache(emptyCache);
    }
    /**
     * Clean up expired sessions
     */
    cleanupExpired() {
        const cache = this.loadCache();
        const now = Date.now();
        for (const [sessionId, cached] of Object.entries(cache.sessions)) {
            const age = now - cached.timestamp;
            if (age > this.expiryMs) {
                delete cache.sessions[sessionId];
            }
        }
        this.saveCache(cache);
    }
    /**
     * Load cache from file
     */
    loadCache() {
        if (!existsSync(this.cachePath)) {
            return { sessions: {}, version: 1 };
        }
        try {
            const content = readFileSync(this.cachePath, "utf-8");
            return JSON.parse(content);
        }
        catch {
            return { sessions: {}, version: 1 };
        }
    }
    /**
     * Save cache to file
     */
    saveCache(cache) {
        try {
            writeFileSync(this.cachePath, JSON.stringify(cache, null, 2), "utf-8");
        }
        catch {
            // Fail silently - cache is optional
        }
    }
    /**
     * Ensure cache directory exists
     */
    ensureCacheDir() {
        try {
            const dir = dirname(this.cachePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
        }
        catch {
            // Fail silently - cache is optional
        }
    }
}
//# sourceMappingURL=cache-manager.js.map