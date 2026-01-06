/**
 * Central widget registry
 * Manages widget lifecycle and retrieval
 */
import type { IWidget, WidgetContext } from '#core/types.js';
/**
 * Registry for managing widgets
 */
export declare class WidgetRegistry {
    private widgets;
    /**
     * Register a widget
     */
    register(widget: IWidget, context?: WidgetContext): Promise<void>;
    /**
     * Unregister a widget
     */
    unregister(id: string): Promise<void>;
    /**
     * Get a widget by id
     */
    get(id: string): IWidget | undefined;
    /**
     * Check if widget is registered
     */
    has(id: string): boolean;
    /**
     * Get all registered widgets
     */
    getAll(): IWidget[];
    /**
     * Get only enabled widgets
     */
    getEnabledWidgets(): IWidget[];
    /**
     * Clear all widgets
     */
    clear(): Promise<void>;
}
//# sourceMappingURL=widget-registry.d.ts.map