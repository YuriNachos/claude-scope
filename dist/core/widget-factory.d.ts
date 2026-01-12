import type { IWidget } from "./types.js";
/**
 * Widget factory - creates widget instances by ID
 *
 * This factory centralizes widget instantiation logic and provides
 * a single point to manage all available widget types.
 */
export declare class WidgetFactory {
    private transcriptProvider;
    constructor();
    /**
     * Create a widget instance by ID
     * @param widgetId - Widget identifier (e.g., "model", "git", "context")
     * @returns Widget instance or null if widget ID is unknown
     */
    createWidget(widgetId: string): IWidget | null;
    /**
     * Get list of all supported widget IDs
     */
    getSupportedWidgetIds(): string[];
}
//# sourceMappingURL=widget-factory.d.ts.map