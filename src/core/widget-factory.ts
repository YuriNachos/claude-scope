import { TranscriptProvider } from "../providers/transcript-provider.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import { ActiveToolsWidget } from "../widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../widgets/config-count-widget.js";
import { ContextWidget } from "../widgets/context-widget.js";
import { CostWidget } from "../widgets/cost-widget.js";
import { DevServerWidget } from "../widgets/dev-server/index.js";
import { DockerWidget } from "../widgets/docker/index.js";
import { DurationWidget } from "../widgets/duration-widget.js";
import { GitTagWidget } from "../widgets/git/git-tag-widget.js";
import { GitWidget } from "../widgets/git/git-widget.js";
import { LinesWidget } from "../widgets/lines-widget.js";
import { ModelWidget } from "../widgets/model-widget.js";
import type { IWidget } from "./types.js";

/**
 * Widget factory - creates widget instances by ID
 *
 * This factory centralizes widget instantiation logic and provides
 * a single point to manage all available widget types.
 */
export class WidgetFactory {
  private transcriptProvider: TranscriptProvider;

  constructor() {
    this.transcriptProvider = new TranscriptProvider();
  }

  /**
   * Create a widget instance by ID
   * @param widgetId - Widget identifier (e.g., "model", "git", "context")
   * @returns Widget instance or null if widget ID is unknown
   */
  createWidget(widgetId: string): IWidget | null {
    switch (widgetId) {
      case "model":
        return new ModelWidget();

      case "context":
        return new ContextWidget();

      case "cost":
        return new CostWidget();

      case "lines":
        return new LinesWidget();

      case "duration":
        return new DurationWidget();

      case "git":
        return new GitWidget();

      case "git-tag":
        return new GitTagWidget();

      case "config-count":
        return new ConfigCountWidget();

      case "cache-metrics":
        return new CacheMetricsWidget(DEFAULT_THEME);

      case "active-tools":
        return new ActiveToolsWidget(DEFAULT_THEME, this.transcriptProvider);

      case "dev-server":
        return new DevServerWidget(DEFAULT_THEME);

      case "docker":
        return new DockerWidget(DEFAULT_THEME);

      default:
        return null; // Unknown widget ID
    }
  }

  /**
   * Get list of all supported widget IDs
   */
  getSupportedWidgetIds(): string[] {
    return [
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
    ];
  }
}
