/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DurationBalancedRenderer } from "./duration/renderers/balanced.js";
import { DurationCompactRenderer } from "./duration/renderers/compact.js";
import { DurationFancyRenderer } from "./duration/renderers/fancy.js";
import { DurationIndicatorRenderer } from "./duration/renderers/indicator.js";
import { DurationLabeledRenderer } from "./duration/renderers/labeled.js";
import { DurationPlayfulRenderer } from "./duration/renderers/playful.js";
import { DurationTechnicalRenderer } from "./duration/renderers/technical.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class DurationWidget extends StdinDataWidget {
    id = "duration";
    metadata = createWidgetMetadata("Duration", "Displays elapsed session time", "1.0.0", "claude-scope", 0 // First line
    );
    renderer = new DurationBalancedRenderer();
    setStyle(style) {
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
    renderWithData(data, _context) {
        if (!data.cost || data.cost.total_duration_ms === undefined)
            return null;
        const renderData = {
            durationMs: data.cost.total_duration_ms,
        };
        return this.renderer.render(renderData);
    }
}
//# sourceMappingURL=duration-widget.js.map