/**
 * Simple time-based cache for system metrics
 * Prevents excessive system calls during rapid re-renders
 */

import type { SysmonRenderData } from "../widgets/sysmon/types.js";

export class MetricsCache {
  private cached: SysmonRenderData | null = null;
  private cacheTime = 0;
  private readonly ttlMs: number;

  constructor(ttlMs: number = 1000) {
    this.ttlMs = ttlMs;
  }

  /**
   * Get cached metrics or fetch fresh if cache expired
   * @param fetcher - Function to fetch fresh metrics
   * @returns Cached or fresh metrics, or null if fetcher returns null
   */
  async get(fetcher: () => Promise<SysmonRenderData | null>): Promise<SysmonRenderData | null> {
    const now = Date.now();

    // Return cached if still valid
    if (this.cached && now - this.cacheTime < this.ttlMs) {
      return this.cached;
    }

    // Fetch fresh metrics
    const fresh = await fetcher();

    // Update cache (even if null, to prevent rapid retries)
    this.cached = fresh;
    this.cacheTime = now;

    return fresh;
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cached = null;
    this.cacheTime = 0;
  }
}
