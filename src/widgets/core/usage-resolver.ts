/**
 * Usage Resolver
 *
 * Shared utility for resolving context usage data from multiple sources.
 * Used by ContextWidget and CacheMetricsWidget to avoid code duplication.
 *
 * Priority order:
 * 1. current_usage from stdin (fastest, most recent)
 * 2. Transcript file (persists during tool execution)
 * 3. Cache manager (5-min TTL)
 */

import { hasRealUsage, UsageParser } from "../../providers/usage-parser.js";
import type { ContextUsage } from "../../schemas/stdin-schema.js";
import { CacheManager } from "../../storage/cache-manager.js";
import type { StdinData } from "../../types.js";

export interface UsageResolutionResult {
  usage: ContextUsage | null;
  sessionChanged: boolean;
}

export interface CumulativeCacheResult {
  cacheRead: number;
  cacheCreation: number;
}

/**
 * Resolves usage data from multiple sources with caching
 */
export class UsageResolver {
  private cacheManager: CacheManager;
  private usageParser: UsageParser;
  private lastSessionId?: string;
  private cachedUsage?: ContextUsage | null;

  constructor() {
    this.cacheManager = new CacheManager();
    this.usageParser = new UsageParser();
  }

  /**
   * Resolve usage data from available sources
   * Updates internal caches as a side effect
   *
   * @param data - Stdin data from Claude Code
   * @returns Resolved usage and session change flag
   */
  async resolve(data: StdinData): Promise<UsageResolutionResult> {
    const sessionId = data.session_id;
    const sessionChanged = !!(this.lastSessionId && this.lastSessionId !== sessionId);
    this.lastSessionId = sessionId;

    const currentUsage = data.context_window?.current_usage;

    // Cache valid usage (skip on session change to avoid caching old session data)
    if (currentUsage && !sessionChanged && sessionId && hasRealUsage(currentUsage)) {
      this.cacheManager.setCachedUsage(sessionId, {
        input_tokens: currentUsage.input_tokens,
        output_tokens: currentUsage.output_tokens,
        cache_creation_input_tokens: currentUsage.cache_creation_input_tokens,
        cache_read_input_tokens: currentUsage.cache_read_input_tokens,
      });
    }

    // Priority 1: current_usage from stdin
    if (hasRealUsage(currentUsage)) {
      this.cachedUsage = undefined;
      return { usage: currentUsage ?? null, sessionChanged };
    }

    // Priority 2: transcript file (parse and cache)
    const transcriptPath = data.transcript_path;
    if (transcriptPath) {
      this.cachedUsage = await this.usageParser.parseLastUsage(transcriptPath);
      if (this.cachedUsage) {
        return { usage: this.cachedUsage, sessionChanged };
      }
    }

    // Priority 3: cache manager
    if (sessionId) {
      const cached = this.cacheManager.getCachedUsage(sessionId);
      if (cached) {
        return { usage: cached.usage, sessionChanged };
      }
    }

    return { usage: null, sessionChanged };
  }

  /**
   * Get cumulative cache data from transcript
   * Shows total cache savings for entire session
   *
   * @param transcriptPath - Path to transcript file
   * @returns Cumulative cache data or null
   */
  async getCumulativeCache(
    transcriptPath: string | undefined
  ): Promise<CumulativeCacheResult | null> {
    if (!transcriptPath) return null;
    return this.usageParser.parseCumulativeCache(transcriptPath);
  }

  /**
   * Get the cached usage from last resolution
   */
  getCachedUsage(): ContextUsage | null | undefined {
    return this.cachedUsage;
  }

  /**
   * Reset resolver state (useful for testing)
   */
  reset(): void {
    this.lastSessionId = undefined;
    this.cachedUsage = undefined;
  }
}
