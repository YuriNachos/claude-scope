/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DEFAULT_THEME } from "../ui/theme/default-theme.js";
import { colorize } from "../ui/utils/formatters.js";
import { ContextBalancedRenderer } from "./context/renderers/balanced.js";
import { ContextCompactRenderer } from "./context/renderers/compact.js";
import { ContextCompactVerboseRenderer } from "./context/renderers/compact-verbose.js";
import { ContextFancyRenderer } from "./context/renderers/fancy.js";
import { ContextIndicatorRenderer } from "./context/renderers/indicator.js";
import { ContextPlayfulRenderer } from "./context/renderers/playful.js";
import { ContextSymbolicRenderer } from "./context/renderers/symbolic.js";
import { ContextVerboseRenderer } from "./context/renderers/verbose.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class ContextWidget extends StdinDataWidget {
    id = "context";
    metadata = createWidgetMetadata("Context", "Displays context window usage with progress bar", "1.0.0", "claude-scope", 0 // First line
    );
    colors;
    renderer;
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME.context;
        this.renderer = new ContextBalancedRenderer();
    }
    setStyle(style) {
        switch (style) {
            case "balanced":
                this.renderer = new ContextBalancedRenderer();
                break;
            case "compact":
                this.renderer = new ContextCompactRenderer();
                break;
            case "playful":
                this.renderer = new ContextPlayfulRenderer();
                break;
            case "verbose":
                this.renderer = new ContextVerboseRenderer();
                break;
            case "symbolic":
                this.renderer = new ContextSymbolicRenderer();
                break;
            case "compact-verbose":
                this.renderer = new ContextCompactVerboseRenderer();
                break;
            case "indicator":
                this.renderer = new ContextIndicatorRenderer();
                break;
            case "fancy":
                this.renderer = new ContextFancyRenderer();
                break;
            default:
                this.renderer = new ContextBalancedRenderer();
        }
    }
    renderWithData(data, _context) {
        const { current_usage, context_window_size } = data.context_window;
        if (!current_usage)
            return null;
        // Calculate actual context usage:
        // - input_tokens: new tokens added to context
        // - cache_creation_input_tokens: tokens spent creating cache (also in context)
        // - cache_read_input_tokens: tokens read from cache (still occupy context space)
        // - output_tokens: tokens in the response (also part of context)
        const used = current_usage.input_tokens +
            current_usage.cache_creation_input_tokens +
            current_usage.cache_read_input_tokens +
            current_usage.output_tokens;
        const percent = Math.round((used / context_window_size) * 100);
        const renderData = {
            used,
            contextWindowSize: context_window_size,
            percent,
        };
        const output = this.renderer.render(renderData);
        const color = this.getContextColor(percent);
        return colorize(output, color);
    }
    getContextColor(percent) {
        const clampedPercent = Math.max(0, Math.min(100, percent));
        if (clampedPercent < 50) {
            return this.colors.low;
        }
        else if (clampedPercent < 80) {
            return this.colors.medium;
        }
        else {
            return this.colors.high;
        }
    }
}
//# sourceMappingURL=context-widget.js.map