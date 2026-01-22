/**
 * Cache Metrics Widget
 *
 * Displays cache hit rate and savings from context usage data
 * Uses cached values when current_usage is null to prevent flickering
 */

import { createWidgetMetadata } from "../../core/widget-types.js";
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
  private lastSessionId?: string;

  constructor(theme?: IThemeColors) {
    super();
    this.theme = theme ?? DEFAULT_THEME;
    this.cacheManager = new CacheManager();
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
   */
  private calculateMetrics(data: StdinData): CacheMetricsRenderData | null {
    let usage = data.context_window?.current_usage;

    // Fall back to cache if current_usage is null
    if (!usage) {
      const cached = this.cacheManager.getCachedUsage(data.session_id);
      if (cached) {
        usage = cached.usage;
      }
    }

    // If no usage data available, return zero metrics (widget should always be visible)
    if (!usage) {
      return {
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        hitRate: 0,
        savings: 0,
      };
    }

    const cacheRead = usage.cache_read_input_tokens ?? 0;
    const cacheWrite = usage.cache_creation_input_tokens ?? 0;
    const inputTokens = usage.input_tokens ?? 0;
    const outputTokens = usage.output_tokens ?? 0;

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

    const sessionChanged = this.lastSessionId && this.lastSessionId !== data.session_id;

    // Detect session change: if session_id changed, reset widget state
    // This ensures that when user presses /new, the widget doesn't show old session's data
    if (sessionChanged) {
      // New session detected - reset renderData to prevent showing old session's data
      // Note: We don't clear the cache here; instead, we skip caching old data
      // by checking !sessionChanged below
      this.renderData = undefined;
    }
    this.lastSessionId = data.session_id;

    // Store valid current_usage in cache
    // Only cache if ANY token value > 0. This prevents zero values from
    // overwriting valid cache data. CacheMetricsWidget should cache when
    // there are cache_read or cache_creation tokens even if input_tokens is 0.
    // Also skip caching when session just changed (to avoid caching old session's data)
    const usage = data.context_window?.current_usage;
    if (usage && !sessionChanged) {
      const hasAnyTokens =
        (usage.input_tokens ?? 0) > 0 ||
        (usage.output_tokens ?? 0) > 0 ||
        (usage.cache_creation_input_tokens ?? 0) > 0 ||
        (usage.cache_read_input_tokens ?? 0) > 0;

      if (hasAnyTokens) {
        this.cacheManager.setCachedUsage(data.session_id, {
          input_tokens: usage.input_tokens,
          output_tokens: usage.output_tokens,
          cache_creation_input_tokens: usage.cache_creation_input_tokens,
          cache_read_input_tokens: usage.cache_read_input_tokens,
        });
      }
    }

    const metrics = this.calculateMetrics(data);
    this.renderData = metrics ?? undefined;
  }

  /**
   * Render the cache metrics display
   */
  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    if (!this.renderData) {
      return null;
    }

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
