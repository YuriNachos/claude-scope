/**
 * SysmonWidget - System monitoring widget
 *
 * Displays real-time system metrics (CPU, RAM, Disk, Network)
 * Fetches metrics on each render for accurate data
 */

import {
  DEFAULT_WIDGET_STYLE,
  type StyleRendererFn,
  type WidgetStyle,
} from "../core/style-types.js";
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
  private styleFn: StyleRendererFn<SysmonRenderData, IThemeColors["sysmon"]> =
    sysmonStyles.balanced!;
  private enabled = true;
  private _lineOverride?: number;

  constructor(colors?: IThemeColors, provider?: ISystemProvider | null) {
    this.colors = colors ?? DEFAULT_THEME;
    this.provider = provider ?? null;
  }

  async initialize(context: WidgetContext): Promise<void> {
    // Respect config.enabled setting (default true if not specified)
    this.enabled = context.config?.enabled !== false;
  }

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.provider || !this.isEnabled()) {
      return null;
    }

    // Fetch fresh metrics on each render
    const metrics = await this.provider.getMetrics();

    if (!metrics) {
      return null;
    }

    return this.styleFn(metrics, this.colors.sysmon);
  }

  async update(_data: unknown): Promise<void> {
    // No-op - SysmonWidget doesn't use stdin data
    // Metrics are fetched on-demand in render()
  }

  isEnabled(): boolean {
    return this.enabled && this.provider !== null;
  }

  setStyle(style: WidgetStyle = DEFAULT_WIDGET_STYLE): void {
    const fn = sysmonStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }
}
