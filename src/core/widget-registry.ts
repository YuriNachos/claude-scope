/**
 * Central widget registry
 * Manages widget lifecycle and retrieval
 */

import type { IWidget, WidgetContext } from "./types.js";

/**
 * Registry for managing widgets
 */
export class WidgetRegistry {
  private widgets: IWidget[] = [];

  /**
   * Register a widget
   */
  async register(widget: IWidget, context?: WidgetContext): Promise<void> {
    if (context) {
      await widget.initialize(context);
    }

    this.widgets.push(widget);
  }

  /**
   * Unregister a widget
   * @param widgetOrId Widget instance or widget id
   */
  async unregister(widgetOrId: IWidget | string): Promise<void> {
    let widget: IWidget | undefined;

    if (typeof widgetOrId === "string") {
      widget = this.widgets.find((w) => w.id === widgetOrId);
    } else {
      widget = this.widgets.find((w) => w === widgetOrId);
    }

    if (!widget) {
      return;
    }

    try {
      if (widget.cleanup) {
        await widget.cleanup();
      }
    } finally {
      const index = this.widgets.indexOf(widget);
      if (index !== -1) {
        this.widgets.splice(index, 1);
      }
    }
  }

  /**
   * Get a widget by id
   */
  get(id: string): IWidget | undefined {
    return this.widgets.find((w) => w.id === id);
  }

  /**
   * Check if widget is registered
   */
  has(id: string): boolean {
    return this.widgets.some((w) => w.id === id);
  }

  /**
   * Get all registered widgets
   */
  getAll(): IWidget[] {
    return [...this.widgets];
  }

  /**
   * Get only enabled widgets
   */
  getEnabledWidgets(): IWidget[] {
    return this.getAll().filter((w) => w.isEnabled());
  }

  /**
   * Clear all widgets
   */
  async clear(): Promise<void> {
    for (const widget of this.widgets) {
      if (widget.cleanup) {
        await widget.cleanup();
      }
    }
    this.widgets = [];
  }
}
