/**
 * Base class for widgets that receive StdinData
 *
 * Uses Template Method Pattern for state management.
 *
 * Extending widgets only need to implement renderWithData() method.
 * The base class handles data storage, update logic, and enables checking.
 */

import type { IWidget, IWidgetMetadata, WidgetContext, RenderContext } from '../../core/types.js';
import type { StdinData } from '../../types.js';

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
export abstract class StdinDataWidget implements IWidget {
  /**
   * Stored stdin data from last update
   */
  protected data: StdinData | null = null;

  /**
   * Widget enabled state
   */
  protected enabled = true;

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
  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  /**
   * Update widget with new stdin data
   * @param data - Stdin data from Claude Code
   */
  async update(data: StdinData): Promise<void> {
    this.data = data;
  }

  /**
   * Get stored stdin data
   * @returns Stored stdin data
   * @throws Error if data has not been initialized (update not called)
   */
  getData(): StdinData {
    if (!this.data) {
      throw new Error(`Widget ${this.id} data not initialized. Call update() first.`);
    }
    return this.data;
  }

  /**
   * Check if widget is enabled
   * @returns true if widget should render
   */
  isEnabled(): boolean {
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
  async render(context: RenderContext): Promise<string | null> {
    if (!this.data || !this.enabled) {
      return null;
    }
    return this.renderWithData(this.data, context);
  }

  /**
   * Hook method for subclasses to implement rendering logic
   *
   * Called by render() template method with guaranteed non-null data.
   *
   * @param data - Stdin data (guaranteed to be non-null)
   * @param context - Render context
   * @returns Rendered string, or null if widget should not display
   */
  protected abstract renderWithData(
    data: StdinData,
    context: RenderContext
  ): string | null;

  /**
   * Optional cleanup method
   * Override if widget has resources to clean up
   */
  async cleanup?(): Promise<void>;
}
