/**
 * Central widget registry
 * Manages widget lifecycle and retrieval
 */
/**
 * Registry for managing widgets
 */
export class WidgetRegistry {
    widgets = new Map();
    /**
     * Register a widget
     */
    async register(widget, context) {
        if (this.widgets.has(widget.id)) {
            throw new Error(`Widget with id '${widget.id}' already registered`);
        }
        if (context) {
            await widget.initialize(context);
        }
        this.widgets.set(widget.id, widget);
    }
    /**
     * Unregister a widget
     */
    async unregister(id) {
        const widget = this.widgets.get(id);
        if (!widget) {
            return;
        }
        try {
            if (widget.cleanup) {
                await widget.cleanup();
            }
        }
        finally {
            this.widgets.delete(id);
        }
    }
    /**
     * Get a widget by id
     */
    get(id) {
        return this.widgets.get(id);
    }
    /**
     * Check if widget is registered
     */
    has(id) {
        return this.widgets.has(id);
    }
    /**
     * Get all registered widgets
     */
    getAll() {
        return Array.from(this.widgets.values());
    }
    /**
     * Get only enabled widgets
     */
    getEnabledWidgets() {
        return this.getAll().filter((w) => w.isEnabled());
    }
    /**
     * Clear all widgets
     */
    async clear() {
        for (const widget of this.widgets.values()) {
            if (widget.cleanup) {
                await widget.cleanup();
            }
        }
        this.widgets.clear();
    }
}
//# sourceMappingURL=widget-registry.js.map