/**
 * Core types for the widget system
 */
import type { RenderContext, StdinData } from "../types.js";
import type { WidgetStyle } from "./style-types.js";
/**
 * Widget metadata describing the widget
 */
export interface IWidgetMetadata {
    name: string;
    description: string;
    version: string;
    author: string;
    /** Which statusline line this widget appears on (0-indexed) */
    line?: number;
}
/**
 * Initialization context passed to widgets
 */
export interface WidgetContext {
    config: Record<string, unknown>;
}
/**
 * Interface that all widgets must implement
 */
export interface IWidget {
    /** Unique widget identifier */
    readonly id: string;
    /** Widget metadata */
    readonly metadata: IWidgetMetadata;
    /**
     * Initialize the widget with context
     * Called once when widget is registered
     */
    initialize(context: WidgetContext): Promise<void>;
    /**
     * Render the widget output
     * Called on each update cycle
     * @returns String to render, or null if widget should not display
     */
    render(context: RenderContext): Promise<string | null>;
    /**
     * Update widget with new data
     * Called when new stdin data arrives
     */
    update(data: StdinData): Promise<void>;
    /**
     * Check if widget is enabled
     * Widget only renders if enabled
     */
    isEnabled(): boolean;
    /**
     * Cleanup resources
     * Optional - called when widget is unregistered
     */
    cleanup?(): Promise<void>;
    /**
     * Set the display style for this widget
     * Optional - widgets that support multiple styles implement this
     */
    setStyle?(style: WidgetStyle): void;
    /**
     * Set the display line for this widget
     * Optional - widgets that support line override implement this
     * @param line - Line number (0-indexed)
     */
    setLine?(line: number): void;
    /**
     * Get the display line for this widget
     * Returns config override if set, otherwise metadata.line default
     * Optional - widgets without this use metadata.line directly
     * @returns Line number (0-indexed)
     */
    getLine?(): number;
}
export type { StdinData, RenderContext };
//# sourceMappingURL=types.d.ts.map