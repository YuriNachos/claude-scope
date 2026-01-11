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
  private style: CacheMetricsStyle = "balanced";
  private renderData?: CacheMetricsRenderData;
  private cacheManager: CacheManager;

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

  /**
   * Calculate cache metrics from context usage data
   * Returns null if no usage data is available (current or cached)
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

    if (!usage) {
      return null;
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

    // Store valid current_usage in cache
    // Only cache if there are meaningful values (input_tokens > 0)
    // This prevents zero values from overwriting valid cache data
    const usage = data.context_window?.current_usage;
    if (usage && usage.input_tokens > 0) {
      this.cacheManager.setCachedUsage(data.session_id, {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens,
        cache_read_input_tokens: usage.cache_read_input_tokens,
      });
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
   * Widget is enabled when we have cache metrics data
   */
  isEnabled(): boolean {
    return this.renderData !== undefined;
  }
}
