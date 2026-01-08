/**
 * Duration Widget
 *
 * Displays elapsed session time
 */

import type { WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { formatDuration } from "../ui/utils/formatters.js";
import { DurationBalancedRenderer } from "./duration/renderers/balanced.js";
import { DurationCompactRenderer } from "./duration/renderers/compact.js";
import { DurationFancyRenderer } from "./duration/renderers/fancy.js";
import { DurationIndicatorRenderer } from "./duration/renderers/indicator.js";
import { DurationLabeledRenderer } from "./duration/renderers/labeled.js";
import { DurationPlayfulRenderer } from "./duration/renderers/playful.js";
import { DurationTechnicalRenderer } from "./duration/renderers/technical.js";
import type { DurationRenderer } from "./duration/renderers/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

export class DurationWidget extends StdinDataWidget {
  readonly id = "duration";
  readonly metadata = createWidgetMetadata(
    "Duration",
    "Displays elapsed session time",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private renderer: DurationRenderer = new DurationBalancedRenderer();

  setStyle(style: WidgetStyle): void {
    switch (style) {
      case "balanced":
        this.renderer = new DurationBalancedRenderer();
        break;
      case "compact":
        this.renderer = new DurationCompactRenderer();
        break;
      case "playful":
        this.renderer = new DurationPlayfulRenderer();
        break;
      case "technical":
        this.renderer = new DurationTechnicalRenderer();
        break;
      case "labeled":
        this.renderer = new DurationLabeledRenderer();
        break;
      case "indicator":
        this.renderer = new DurationIndicatorRenderer();
        break;
      case "fancy":
        this.renderer = new DurationFancyRenderer();
        break;
      default:
        this.renderer = new DurationBalancedRenderer();
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    if (!data.cost || data.cost.total_duration_ms === undefined) return null;

    const renderData = {
      durationMs: data.cost.total_duration_ms,
    };

    return this.renderer.render(renderData);
  }
}
