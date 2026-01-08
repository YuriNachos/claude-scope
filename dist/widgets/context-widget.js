/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import { contextStyles } from "./context/styles.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export class ContextWidget extends StdinDataWidget {
    id = "context";
    metadata = createWidgetMetadata("Context", "Displays context window usage with progress bar", "1.0.0", "claude-scope", 0 // First line
    );
    colors;
    styleFn = contextStyles.balanced;
    constructor(colors) {
        super();
        this.colors = colors ?? DEFAULT_THEME;
    }
    setStyle(style = "balanced") {
        const fn = contextStyles[style];
        if (fn) {
            this.styleFn = fn;
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
        // Style functions now handle colorization based on percent
        return this.styleFn(renderData, this.colors.context);
    }
}
//# sourceMappingURL=context-widget.js.map