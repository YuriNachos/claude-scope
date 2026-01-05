/**
 * Base class for widgets that receive StdinData
 *
 * Eliminates duplicate data storage and update logic across widgets.
 * Extending widgets only need to implement render() method.
 */
/**
 * Abstract base class for widgets working with StdinData
 *
 * Provides common functionality:
 * - StdinData storage and retrieval
 * - Enabled state management
 * - Consistent update pattern
 *
 * @example
 * ```typescript
 * export class ModelWidget extends StdinDataWidget {
 *   readonly id = 'model';
 *   readonly metadata = {
 *     name: 'Model',
 *     description: 'Displays Claude model',
 *     version: '1.0.0',
 *     author: 'claude-scope'
 *   };
 *
 *   async render(context: RenderContext): Promise<string | null> {
 *     const data = this.getData();
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
     * Get stored stdin data
     * @returns StdinData
     * @throws Error if data not initialized (update() not called)
     */
    getData() {
        if (!this.data) {
            throw new Error(`Widget ${this.id} data not initialized. Call update() before render().`);
        }
        return this.data;
    }
}
//# sourceMappingURL=stdin-data-widget.js.map