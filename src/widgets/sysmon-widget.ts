/**
 * SysmonWidget - System monitoring widget
 *
 * Displays real-time system metrics (CPU, RAM, Disk, Network)
 * Independent of stdin - polls system directly via SystemProvider
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import type { IWidget, RenderContext, WidgetContext } from "../core/types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { ISystemProvider } from "../providers/system-provider.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { sysmonStyles } from "./sysmon/styles.js";
import type { SysmonRenderData } from "./sysmon/types.js";

export class SysmonWidget implements IWidget {
  readonly id = "sysmon";
  readonly metadata = createWidgetMetadata(
    "Sysmon",
    "System monitoring: CPU, RAM, Disk, Network metrics",
    "1.0.0",
    "claude-scope",
    2 // Default to line 2
  );

  private colors: IThemeColors;
  private provider: ISystemProvider | null;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<SysmonRenderData, IThemeColors["sysmon"]> =
    sysmonStyles.balanced!;
  private currentMetrics: SysmonRenderData | null = null;
  private updateIntervalMs = 2500; // 2.5 seconds
  private enabled = true;

  constructor(colors?: IThemeColors, provider?: ISystemProvider | null) {
    this.colors = colors ?? DEFAULT_THEME;
    this.provider = provider ?? null;
  }

  async initialize(context: WidgetContext): Promise<void> {
    // Respect config.enabled setting (default true if not specified)
    this.enabled = context.config?.enabled !== false;

    if (!this.provider || !this.enabled) {
      return;
    }

    // Get initial metrics
    this.currentMetrics = await this.provider.getMetrics();

    // Start background updates
    this.provider.startUpdate(this.updateIntervalMs, (metrics) => {
      this.currentMetrics = metrics;
    });
  }

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.currentMetrics || !this.isEnabled()) {
      return null;
    }

    return this.styleFn(this.currentMetrics, this.colors.sysmon);
  }

  async update(_data: unknown): Promise<void> {
    // No-op - SysmonWidget doesn't use stdin data
    // Updates come via background callback
  }

  isEnabled(): boolean {
    return this.enabled && this.provider !== null;
  }

  async cleanup(): Promise<void> {
    this.provider?.stopUpdate();
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = sysmonStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 2;
  }
}
