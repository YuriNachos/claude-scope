/**
 * Dev Server Widget
 *
 * Detects running development server processes using hybrid detection:
 * 1. Port-based detection (primary) - checks listening ports via lsof
 * 2. Process-based detection (fallback) - checks process list via ps
 */

import type { StyleRendererFn, WidgetStyle } from "../../core/style-types.js";
import type { IWidget, RenderContext, StdinData, WidgetContext } from "../../core/types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IDevServerColors, IThemeColors } from "../../ui/theme/types.js";
import { PortDetector } from "./port-detector.js";
import { ProcessDetector } from "./process-detector.js";
import { devServerStyles } from "./styles.js";
import type { DevServerRenderData } from "./types.js";

/**
 * Dev Server Widget
 *
 * Hybrid detection: port-based (primary) + process-based (fallback)
 */
export class DevServerWidget implements IWidget {
  readonly id = "dev-server";
  readonly metadata = createWidgetMetadata(
    "Dev Server",
    "Detects running dev server processes using hybrid port+process detection",
    "1.1.0",
    "claude-scope",
    0
  );

  private enabled = true;
  private colors: IThemeColors;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<DevServerRenderData, IDevServerColors> =
    devServerStyles.balanced!;
  private cwd: string | null = null;
  private portDetector: PortDetector;
  private processDetector: ProcessDetector;

  constructor(colors?: IThemeColors) {
    this.colors = colors ?? DEFAULT_THEME;
    this.portDetector = new PortDetector();
    this.processDetector = new ProcessDetector();
  }

  /**
   * Set display style
   * @param style - Style to use for rendering
   */
  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = devServerStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  /**
   * Set display line override
   * @param line - Line number (0-indexed)
   */
  setLine(line: number): void {
    this._lineOverride = line;
  }

  /**
   * Get display line
   * @returns Line number (0-indexed)
   */
  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  /**
   * Initialize widget with context
   * @param context - Widget initialization context
   */
  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  /**
   * Update widget with new stdin data
   * @param data - Stdin data from Claude Code
   */
  async update(data: StdinData): Promise<void> {
    this.cwd = data.cwd || null;
  }

  /**
   * Check if widget is enabled
   * @returns true if widget should render
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // No resources to clean up
  }

  /**
   * Render widget output
   * @param context - Render context
   * @returns Rendered string, or null if no dev server detected
   */
  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.cwd) {
      return null;
    }

    const server = await this.detectDevServer();
    if (!server) {
      return null;
    }

    const renderData: DevServerRenderData = { server };
    return this.styleFn(renderData, this.colors.devServer);
  }

  /**
   * Detect running dev server using hybrid approach
   *
   * 1. Try port-based detection first (more reliable)
   * 2. Fall back to process-based detection
   *
   * @returns Detected server status or null
   */
  private async detectDevServer(): Promise<{
    name: string;
    icon: string;
    isRunning: boolean;
    isBuilding: boolean;
  } | null> {
    // 1. Try port-based detection (primary)
    const portResult = await this.portDetector.detect();
    if (portResult) {
      return {
        name: portResult.name,
        icon: portResult.icon,
        isRunning: portResult.isRunning,
        isBuilding: portResult.isBuilding,
      };
    }

    // 2. Fall back to process-based detection
    return await this.processDetector.detect();
  }
}
