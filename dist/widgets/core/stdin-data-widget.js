/**
 * Base class for widgets that receive StdinData
 *
 * Uses Template Method Pattern for state management.
 *
 * Extending widgets only need to implement renderWithData() method.
 * The base class handles data storage, update logic, and enables checking.
 */
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
export class StdinDataWidget {
    /**
     * Stored stdin data from last update
     */
    data = null;
    /**
     * Widget enabled state
     */
    enabled = true;
    /**
     * Initialize widget with context
     * @param context - Widget initialization context
     */
    async initialize(context) {
        this.enabled = context.config?.enabled !== false;
    }
    /**
     * Update widget with new stdin data
     * @param data - Stdin data from Claude Code
     */
    async update(data) {
        this.data = data;
    }
    /**
     * Check if widget is enabled
     * @returns true if widget should render
     */
    isEnabled() {
        return this.enabled;
    }
    /**
     * Template method - final, subclasses implement renderWithData()
     *
     * Handles null data checks and calls renderWithData() hook.
     *
     * @param context - Render context
     * @returns Rendered string, or null if widget should not display
     */
    async render(context) {
        if (!this.data || !this.enabled) {
            return null;
        }
        return this.renderWithData(this.data, context);
    }
}
//# sourceMappingURL=stdin-data-widget.js.map