/**
 * Config Count Widget
 *
 * Displays Claude Code configuration counts on second statusline line.
 * Data source: ConfigProvider scans filesystem.
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { DEFAULT_WIDGET_STYLE } from "../core/style-types.js";
import type { IWidget, RenderContext, StdinData } from "../core/types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import { type ConfigCounts, ConfigProvider } from "../providers/config-provider.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { configCountStyles } from "./config-count/styles.js";
import type { ConfigCountStyleRenderData } from "./config-count/types.js";

/**
 * Widget displaying configuration counts
 *
 * Shows: 📄 N CLAUDE.md │ 📜 N rules │ 🔌 N MCPs │ 🪝 N hooks
 * Only appears on line 1 (second line).
 * Hides if all counts are zero.
 */
export class ConfigCountWidget implements IWidget {
  readonly id = "config-count";
  readonly metadata = createWidgetMetadata(
    "Config Count",
    "Displays Claude Code configuration counts",
    "1.0.0",
    "claude-scope",
    1 // Second line
  );

  private configProvider = new ConfigProvider();
  private configs?: ConfigCounts;
  private cwd?: string;
  private themeColors: IThemeColors;
  private styleFn: StyleRendererFn<ConfigCountStyleRenderData, IThemeColors> =
    configCountStyles.balanced!;

  constructor(themeColors?: IThemeColors) {
    this.themeColors = themeColors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = DEFAULT_WIDGET_STYLE): void {
    const fn = configCountStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  async initialize(): Promise<void> {
    // No initialization needed
  }

  async update(data: StdinData): Promise<void> {
    this.cwd = data.cwd;
    this.configs = await this.configProvider.getConfigs({ cwd: data.cwd });
  }

  isEnabled(): boolean {
    // Only show if we have configs AND at least one count > 0
    if (!this.configs) {
      return false;
    }

    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
    return claudeMdCount > 0 || rulesCount > 0 || mcpCount > 0 || hooksCount > 0;
  }

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.configs) {
      return null;
    }

    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
    const renderData: ConfigCountStyleRenderData = {
      claudeMdCount,
      rulesCount,
      mcpCount,
      hooksCount,
      colors: this.themeColors,
    };

    return this.styleFn(renderData, this.themeColors);
  }

  async cleanup(): Promise<void> {
    // No cleanup needed
  }
}
