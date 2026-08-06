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
 * Every widget id the factory can build
 *
 * Exported so callers that only need the list - config validation, for one -
 * do not construct a factory just to read it.
 */
export const SUPPORTED_WIDGET_IDS = [
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
] as const;

export type SupportedWidgetId = (typeof SUPPORTED_WIDGET_IDS)[number];

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
    const build = this.builders()[widgetId as SupportedWidgetId];
    return build ? build() : null;
  }

  /**
   * Get list of all supported widget IDs
   */
  getSupportedWidgetIds(): string[] {
    return [...SUPPORTED_WIDGET_IDS];
  }

  /**
   * Constructor for every supported widget
   *
   * Typed as a total map over SUPPORTED_WIDGET_IDS, so an id listed there with
   * no constructor - or a constructor for an unlisted id - fails to compile.
   * The two used to be a switch and a hand-maintained array that could drift.
   */
  private builders(): Record<SupportedWidgetId, () => IWidget> {
    return {
      cwd: () => new CwdWidget(this.theme),
      model: () => new ModelWidget(this.theme),
      context: () => new ContextWidget(this.theme),
      cost: () => new CostWidget(this.theme),
      lines: () => new LinesWidget(this.theme),
      duration: () => new DurationWidget(this.theme),
      git: () => new GitWidget(undefined, this.theme),
      "git-tag": () => new GitTagWidget(undefined, this.theme),
      "config-count": () => new ConfigCountWidget(undefined, this.theme),
      "cache-metrics": () => new CacheMetricsWidget(this.theme),
      "active-tools": () => new ActiveToolsWidget(this.theme, this.transcriptProvider),
      "dev-server": () => new DevServerWidget(this.theme),
      docker: () => new DockerWidget(this.theme),
      poker: () => new PokerWidget(this.theme),
      sysmon: () => new SysmonWidget(this.theme, this.systemProvider),
      "empty-line": () => new EmptyLineWidget(),
    };
  }
}
