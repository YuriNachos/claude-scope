/**
 * Unified rendering engine with error boundaries
 * Combines widget outputs into statusline
 */
import type { RenderContext } from "../types.js";
import type { IWidget } from "./types.js";
/**
 * Renderer configuration options
 */
export interface RendererOptions {
    /** Separator between widget outputs */
    separator?: string;
    /** Error handler callback for widget render failures */
    onError?: (error: Error, widget: IWidget) => void;
    /** Show error placeholder in output (for debugging) */
    showErrors?: boolean;
}
/**
 * Renderer for combining widget outputs with error boundaries
 *
 * Failed widgets are gracefully skipped, preventing single widget
 * failures from breaking the entire statusline.
 */
export declare class Renderer {
    private separator;
    private onError?;
    private showErrors;
    constructor(options?: RendererOptions);
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
    render(widgets: IWidget[], context: RenderContext): Promise<string[]>;
    /**
     * Set custom separator
     */
    setSeparator(separator: string): void;
    /**
     * Handle widget render errors
     *
     * Calls the onError callback if provided, otherwise logs to console.warn
     */
    private handleError;
}
//# sourceMappingURL=renderer.d.ts.map