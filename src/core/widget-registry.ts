/**
 * Central widget registry
 * Manages widget lifecycle and retrieval
 */

import type { IWidget, WidgetContext } from './types.js';

/**
 * Registry for managing widgets
 */
export class WidgetRegistry {
  private widgets: Map<string, IWidget> = new Map();

  /**
   * Register a widget
   */
  async register(widget: IWidget, context?: WidgetContext): Promise<void> {
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
  async unregister(id: string): Promise<void> {
    const widget = this.widgets.get(id);
    if (!widget) {
      return;
    }

    if (widget.cleanup) {
      await widget.cleanup();
    }

    this.widgets.delete(id);
  }

  /**
   * Get a widget by id
   */
  get(id: string): IWidget | undefined {
    return this.widgets.get(id);
  }

  /**
   * Check if widget is registered
   */
  has(id: string): boolean {
    return this.widgets.has(id);
  }

  /**
   * Get all registered widgets
   */
  getAll(): IWidget[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Get only enabled widgets
   */
  getEnabledWidgets(): IWidget[] {
    return this.getAll().filter(w => w.isEnabled());
  }

  /**
   * Clear all widgets
   */
  async clear(): Promise<void> {
    for (const widget of this.widgets.values()) {
      if (widget.cleanup) {
        await widget.cleanup();
      }
    }
    this.widgets.clear();
  }
}
