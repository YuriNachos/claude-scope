/**
 * Cache Metrics Widget
 *
 * Displays cache hit rate and savings from context usage data
 * Uses UsageParser to read usage from transcript files when current_usage is null
 */

import { createWidgetMetadata } from "../../core/widget-types.js";
import { UsageParser } from "../../providers/usage-parser.js";
import type { ContextUsage } from "../../schemas/stdin-schema.js";
import { CacheManager } from "../../storage/cache-manager.js";
import type { RenderContext, StdinData } from "../../types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import { cacheMetricsStyles } from "./styles.js";
import type { CacheMetricsRenderData, CacheMetricsStyle } from "./types.js";

export class CacheMetricsWidget extends StdinDataWidget {
  readonly id = "cache-metrics";
  readonly metadata = createWidgetMetadata(
    "Cache Metrics",
    "Cache hit rate and savings display",
    "1.0.0",
    "claude-scope",
    2 // Third line
  );

  private theme: IThemeColors;
  private _lineOverride?: number;
  private style: CacheMetricsStyle = "balanced";
  private renderData?: CacheMetricsRenderData;
  private cacheManager: CacheManager;
  private usageParser: UsageParser;
  private lastSessionId?: string;
  private cachedUsage?: ContextUsage | null; // Cache parsed usage within render cycle
  private cachedCumulativeCache?: { cacheRead: number; cacheCreation: number } | null; // Cumulative cache for session

  constructor(theme?: IThemeColors) {
    super();
    this.theme = theme ?? DEFAULT_THEME;
    this.cacheManager = new CacheManager();
    this.usageParser = new UsageParser();
  }

  /**
   * Set display style
   */
  setStyle(style: CacheMetricsStyle): void {
    this.style = style;
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  /**
   * Calculate cache metrics from context usage data
   * Returns zero metrics if no usage data is available (widget should always be visible)
   *
   * @param usage - Current usage data (for total tokens calculation)
   * @param cumulativeCache - Cumulative cache data for the session (optional)
   */
  private calculateMetrics(
    usage: ContextUsage | null,
    cumulativeCache?: { cacheRead: number; cacheCreation: number } | null
  ): CacheMetricsRenderData | null {
    // Use cumulative cache if available (from transcript), otherwise use current usage
    // Cumulative cache shows total cache savings for the entire session
    const cacheRead = cumulativeCache?.cacheRead ?? usage?.cache_read_input_tokens ?? 0;
    const cacheWrite = cumulativeCache?.cacheCreation ?? usage?.cache_creation_input_tokens ?? 0;

    // If no usage data available at all, return zero metrics (widget should always be visible)
    if (!usage && !cumulativeCache) {
      return {
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        hitRate: 0,
        savings: 0,
      };
    }

    const inputTokens = usage?.input_tokens ?? 0;
    const outputTokens = usage?.output_tokens ?? 0;

    // FIX: Total input tokens = cache read + cache write + new input tokens
    // The input_tokens field only contains NEW (non-cached) tokens
    const totalInputTokens = cacheRead + cacheWrite + inputTokens;
    const totalTokens = totalInputTokens + outputTokens;

    // Cache hit rate = cache read / total input tokens (capped at 100%)
    const hitRate =
      totalInputTokens > 0 ? Math.min(100, Math.round((cacheRead / totalInputTokens) * 100)) : 0;

    // Cost savings: cache costs 10% of regular tokens
    // Savings = (cacheRead * 0.9) * cost_per_token
    // Assuming $3/M for input tokens
    const costPerToken = 0.000003;
    const savings = cacheRead * 0.9 * costPerToken;

    return {
      cacheRead,
      cacheWrite,
      totalTokens,
      hitRate,
      savings,
    };
  }

  /**
   * Update widget with new data and calculate metrics
   * Stores valid usage data in cache for future use
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    const sessionId = data.session_id;
    const sessionChanged = this.lastSessionId && this.lastSessionId !== sessionId;

    // Detect session change: if session_id changed, reset widget state
    // This ensures that when user presses /new, the widget doesn't show old session's data
    if (sessionChanged) {
      // New session detected - reset renderData to prevent showing old session's data
      // Note: We don't clear the cache here; instead, we skip caching old data
      // by checking !sessionChanged below
      this.renderData = undefined;
    }
    this.lastSessionId = sessionId;

    // Store valid current_usage in cache
    // Only cache if ANY token value > 0. This prevents zero values from
    // overwriting valid cache data. CacheMetricsWidget should cache when
    // there are cache_read or cache_creation tokens even if input_tokens is 0.
    // Also skip caching when session just changed (to avoid caching old session's data)
    const usage = data.context_window?.current_usage;
    if (usage && !sessionChanged && sessionId) {
      const hasAnyTokens =
        (usage.input_tokens ?? 0) > 0 ||
        (usage.output_tokens ?? 0) > 0 ||
        (usage.cache_creation_input_tokens ?? 0) > 0 ||
        (usage.cache_read_input_tokens ?? 0) > 0;

      if (hasAnyTokens) {
        this.cacheManager.setCachedUsage(sessionId, {
          input_tokens: usage.input_tokens,
          output_tokens: usage.output_tokens,
          cache_creation_input_tokens: usage.cache_creation_input_tokens,
          cache_read_input_tokens: usage.cache_read_input_tokens,
        });
      }
    }

    // Parse usage from transcript for use in render (done once per update)
    // Priority 1: current_usage (checked in renderWithData)
    // Priority 2: transcript file (persists during tool execution)
    // Priority 3: cache manager (5-min cache)

    // For current usage (most recent message): used when current_usage is null/empty
    const hasRealUsage =
      usage &&
      ((usage.input_tokens ?? 0) > 0 ||
        (usage.output_tokens ?? 0) > 0 ||
        (usage.cache_read_input_tokens ?? 0) > 0 ||
        (usage.cache_creation_input_tokens ?? 0) > 0);

    const transcriptPath = data.transcript_path;
    if (!usage || !hasRealUsage) {
      // current_usage is null or all zeros - try transcript
      if (transcriptPath) {
        this.cachedUsage = await this.usageParser.parseLastUsage(transcriptPath);
      }
    } else {
      // current_usage has real data - clear cached transcript usage
      this.cachedUsage = undefined;
    }

    // For cumulative cache (session total): always parse from transcript
    // This shows total cache savings for the entire session
    if (transcriptPath) {
      this.cachedCumulativeCache = await this.usageParser.parseCumulativeCache(transcriptPath);
    }
  }

  /**
   * Render the cache metrics display
   */
  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    // Priority 1: current_usage from stdin (fastest, most recent)
    let usage = data.context_window?.current_usage;

    // Check if current_usage has real data (not all zeros)
    const hasRealUsage =
      usage &&
      ((usage.input_tokens ?? 0) > 0 ||
        (usage.output_tokens ?? 0) > 0 ||
        (usage.cache_read_input_tokens ?? 0) > 0 ||
        (usage.cache_creation_input_tokens ?? 0) > 0);

    // Priority 2: usage parsed from transcript (persists during tool execution)
    // Use transcript if current_usage is null or has no real data
    if ((!usage || !hasRealUsage) && this.cachedUsage) {
      usage = this.cachedUsage;
    }

    // Priority 3: cache manager (5-min cache)
    if (!usage && data.session_id) {
      const cached = this.cacheManager.getCachedUsage(data.session_id);
      if (cached) {
        usage = cached.usage;
      }
    }

    // Use cumulative cache from transcript for cache metrics (shows session total)
    // When current_usage has real data, we still use cumulative cache for cache metrics
    // because it shows the total savings for the entire session
    const cumulativeCacheToUse = this.cachedCumulativeCache;

    const metrics = this.calculateMetrics(usage || null, cumulativeCacheToUse || null);
    if (!metrics) {
      return null;
    }

    this.renderData = metrics;

    const styleFn = cacheMetricsStyles[this.style] ?? cacheMetricsStyles.balanced;
    if (!styleFn) {
      return null;
    }
    return styleFn(this.renderData, this.theme);
  }

  /**
   * Widget is always enabled (shows zeros when no data)
   */
  isEnabled(): boolean {
    return true;
  }
}
