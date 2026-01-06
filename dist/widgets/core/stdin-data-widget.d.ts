/**
 * Base class for widgets that receive StdinData
 *
 * Uses Template Method Pattern for state management.
 *
 * Extending widgets only need to implement renderWithData() method.
 * The base class handles data storage, update logic, and enables checking.
 */
import type { IWidget, IWidgetMetadata, WidgetContext, RenderContext } from '#core/types.js';
import type { StdinData } from '#types.js';
/**
 * Abstract base class for widgets working with StdinData
 *
 * Uses Template Method Pattern:
 * - render() is final template method that handles null checks
 * - Subclasses implement renderWithData() hook with data as parameter
 *
 * @example
 * ```typescript
 * export class ModelWidget extends StdinDataWidget {
 *   readonly id = 'model';
 *   readonly metadata = createWidgetMetadata('Model', 'Displays Claude model');
 *
 *   protected renderWithData(data: StdinData, context: RenderContext): string | null {
 *     return data.model.display_name;
 *   }
 * }
 * ```
 */
export declare abstract class StdinDataWidget implements IWidget {
    /**
     * Stored stdin data from last update
     */
    protected data: StdinData | null;
    /**
     * Widget enabled state
     */
    protected enabled: boolean;
    /**
     * Unique widget identifier
     */
    abstract readonly id: string;
    /**
     * Widget metadata
     */
    abstract readonly metadata: IWidgetMetadata;
    /**
     * Initialize widget with context
     * @param context - Widget initialization context
     */
    initialize(context: WidgetContext): Promise<void>;
    /**
     * Update widget with new stdin data
     * @param data - Stdin data from Claude Code
     */
    update(data: StdinData): Promise<void>;
    /**
     * Check if widget is enabled
     * @returns true if widget should render
     */
    isEnabled(): boolean;
    /**
     * Template method - final, subclasses implement renderWithData()
     *
     * Handles null data checks and calls renderWithData() hook.
     *
     * @param context - Render context
     * @returns Rendered string, or null if widget should not display
     */
    render(context: RenderContext): Promise<string | null>;
    /**
     * Hook method for subclasses to implement rendering logic
     *
     * Called by render() template method with guaranteed non-null data.
     *
     * @param data - Stdin data (guaranteed to be non-null)
     * @param context - Render context
     * @returns Rendered string, or null if widget should not display
     */
    protected abstract renderWithData(data: StdinData, context: RenderContext): string | null;
    /**
     * Optional cleanup method
     * Override if widget has resources to clean up
     */
    cleanup?(): Promise<void>;
}
//# sourceMappingURL=stdin-data-widget.d.ts.map