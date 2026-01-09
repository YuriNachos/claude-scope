/**
 * Cache Metrics Widget
 *
 * Displays cache hit rate and savings from context usage data
 */
import type { RenderContext, StdinData } from "../../types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import type { CacheMetricsStyle } from "./types.js";
export declare class CacheMetricsWidget extends StdinDataWidget {
    readonly id = "cache-metrics";
    readonly metadata: import("../../core/types.js").IWidgetMetadata;
    private theme;
    private style;
    private renderData?;
    constructor(theme?: IThemeColors);
    /**
     * Set display style
     */
    setStyle(style: CacheMetricsStyle): void;
    /**
     * Calculate cache metrics from context usage data
     * Returns null if no usage data is available
     */
    private calculateMetrics;
    /**
     * Update widget with new data and calculate metrics
     */
    update(data: StdinData): Promise<void>;
    /**
     * Render the cache metrics display
     */
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
    /**
     * Widget is enabled when we have cache metrics data
     */
    isEnabled(): boolean;
}
//# sourceMappingURL=cache-metrics-widget.d.ts.map