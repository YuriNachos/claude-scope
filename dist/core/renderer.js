/**
 * Unified rendering engine with error boundaries
 * Combines widget outputs into statusline
 */
import { DEFAULTS } from "../constants.js";
/**
 * Renderer for combining widget outputs with error boundaries
 *
 * Failed widgets are gracefully skipped, preventing single widget
 * failures from breaking the entire statusline.
 */
export class Renderer {
    separator;
    onError;
    showErrors;
    constructor(options = {}) {
        this.separator = options.separator ?? DEFAULTS.SEPARATOR;
        this.onError = options.onError;
        this.showErrors = options.showErrors ?? false;
    }
    /**
     * Render widgets into multiple lines with error boundaries
     *
     * Widgets are grouped by their metadata.line property and rendered
     * on separate lines. Widgets that throw errors are logged (via onError
     * callback) and skipped, allowing other widgets to continue rendering.
     *
     * @param widgets - Array of widgets to render
     * @param context - Render context with width and timestamp
     * @returns Array of rendered lines (one per line number)
     */
    async render(widgets, context) {
        // Group widgets by line
        const lineMap = new Map();
        for (const widget of widgets) {
            if (!widget.isEnabled()) {
                continue;
            }
            const line = widget.getLine ? widget.getLine() : (widget.metadata.line ?? 0);
            if (!lineMap.has(line)) {
                lineMap.set(line, []);
            }
            lineMap.get(line)?.push(widget);
        }
        // Render each line
        const lines = [];
        const sortedLines = Array.from(lineMap.entries()).sort((a, b) => a[0] - b[0]);
        for (const [, widgetsForLine] of sortedLines) {
            const outputs = [];
            for (const widget of widgetsForLine) {
                try {
                    const output = await widget.render(context);
                    if (output !== null) {
                        outputs.push(output);
                    }
                }
                catch (error) {
                    this.handleError(error, widget);
                    if (this.showErrors) {
                        outputs.push(`${widget.id}:<err>`);
                    }
                }
            }
            const line = outputs.join(this.separator);
            // Include line if there are outputs (even if empty string for separator widgets)
            if (outputs.length > 0) {
                lines.push(line);
            }
        }
        return lines;
    }
    /**
     * Set custom separator
     */
    setSeparator(separator) {
        this.separator = separator;
    }
    /**
     * Handle widget render errors
     *
     * Calls the onError callback if provided, otherwise logs to console.warn
     */
    handleError(error, widget) {
        if (this.onError) {
            this.onError(error, widget);
        }
        else {
            // Default: silent fail with console.warn
            console.warn(`[Widget ${widget.id}] ${error.message}`);
        }
    }
}
//# sourceMappingURL=renderer.js.map