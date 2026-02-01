import { SystemProvider } from "../providers/system-provider.js";
import { TranscriptProvider } from "../providers/transcript-provider.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IThemeColors } from "../ui/theme/types.js";
import { ActiveToolsWidget } from "../widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../widgets/config-count-widget.js";
import { ContextWidget } from "../widgets/context-widget.js";
import { CostWidget } from "../widgets/cost-widget.js";
import { CwdWidget } from "../widgets/cwd/index.js";
import { DevServerWidget } from "../widgets/dev-server/index.js";
import { DockerWidget } from "../widgets/docker/index.js";
import { DurationWidget } from "../widgets/duration-widget.js";
import { EmptyLineWidget } from "../widgets/empty-line-widget.js";
import { GitTagWidget } from "../widgets/git/git-tag-widget.js";
import { GitWidget } from "../widgets/git/git-widget.js";
import { LinesWidget } from "../widgets/lines-widget.js";
import { ModelWidget } from "../widgets/model-widget.js";
import { PokerWidget } from "../widgets/poker-widget.js";
import { SysmonWidget } from "../widgets/sysmon-widget.js";
import type { IWidget } from "./types.js";

/**
 * Widget factory - creates widget instances by ID
 *
 * This factory centralizes widget instantiation logic and provides
 * a single point to manage all available widget types.
 *
 * Supports custom themes via constructor parameter.
 */
export class WidgetFactory {
  private transcriptProvider: TranscriptProvider;
  private systemProvider: SystemProvider;
  private theme: IThemeColors;

  /**
   * @param theme - Optional theme colors. Defaults to DEFAULT_THEME (Monokai).
   */
  constructor(theme?: IThemeColors) {
    this.transcriptProvider = new TranscriptProvider();
    this.systemProvider = new SystemProvider();
    this.theme = theme ?? DEFAULT_THEME;
  }

  /**
   * Create a widget instance by ID
   * @param widgetId - Widget identifier (e.g., "model", "git", "context")
   * @returns Widget instance or null if widget ID is unknown
   */
  createWidget(widgetId: string): IWidget | null {
    switch (widgetId) {
      case "cwd":
        return new CwdWidget(this.theme);

      case "model":
        return new ModelWidget(this.theme);

      case "context":
        return new ContextWidget(this.theme);

      case "cost":
        return new CostWidget(this.theme);

      case "lines":
        return new LinesWidget(this.theme);

      case "duration":
        return new DurationWidget(this.theme);

      case "git":
        return new GitWidget(undefined, this.theme);

      case "git-tag":
        return new GitTagWidget(undefined, this.theme);

      case "config-count":
        return new ConfigCountWidget(undefined, this.theme);

      case "cache-metrics":
        return new CacheMetricsWidget(this.theme);

      case "active-tools":
        return new ActiveToolsWidget(this.theme, this.transcriptProvider);

      case "dev-server":
        return new DevServerWidget(this.theme);

      case "docker":
        return new DockerWidget(this.theme);

      case "poker":
        return new PokerWidget(this.theme);

      case "sysmon":
        return new SysmonWidget(this.theme, this.systemProvider);

      case "empty-line":
        return new EmptyLineWidget();

      default:
        return null; // Unknown widget ID
    }
  }

  /**
   * Get list of all supported widget IDs
   */
  getSupportedWidgetIds(): string[] {
    return [
      "cwd",
      "model",
      "context",
      "cost",
      "lines",
      "duration",
      "git",
      "git-tag",
      "config-count",
      "cache-metrics",
      "active-tools",
      "dev-server",
      "docker",
      "poker",
      "sysmon",
      "empty-line",
    ];
  }
}
