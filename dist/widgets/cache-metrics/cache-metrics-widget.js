/**
 * Cache Metrics Widget
 *
 * Displays cache hit rate and savings from context usage data
 */
import { createWidgetMetadata } from "../../core/widget-types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import { cacheMetricsStyles } from "./styles.js";
export class CacheMetricsWidget extends StdinDataWidget {
    id = "cache-metrics";
    metadata = createWidgetMetadata("Cache Metrics", "Cache hit rate and savings display", "1.0.0", "claude-scope", 2 // Third line
    );
    theme;
    style = "balanced";
    renderData;
    constructor(theme) {
        super();
        this.theme = theme ?? DEFAULT_THEME;
    }
    /**
     * Set display style
     */
    setStyle(style) {
        this.style = style;
    }
    /**
     * Calculate cache metrics from context usage data
     * Returns null if no usage data is available
     */
    calculateMetrics(data) {
        const usage = data.context_window?.current_usage;
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
        const hitRate = totalInputTokens > 0 ? Math.min(100, Math.round((cacheRead / totalInputTokens) * 100)) : 0;
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
     */
    async update(data) {
        await super.update(data);
        const metrics = this.calculateMetrics(data);
        this.renderData = metrics ?? undefined;
    }
    /**
     * Render the cache metrics display
     */
    renderWithData(_data, _context) {
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
    isEnabled() {
        return this.renderData !== undefined;
    }
}
//# sourceMappingURL=cache-metrics-widget.js.map