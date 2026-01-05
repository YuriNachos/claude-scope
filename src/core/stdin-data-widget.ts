/**
 * Base class for widgets that receive StdinData
 *
 * Eliminates duplicate data storage and update logic across widgets.
 * Extending widgets only need to implement render() method.
 */

import type { IWidget, IWidgetMetadata, WidgetContext, RenderContext } from './types.js';
import type { StdinData } from '../types.js';

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
   * Check if widget is enabled
   * @returns true if widget should render
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get stored stdin data
   * @returns StdinData
   * @throws Error if data not initialized (update() not called)
   */
  protected getData(): StdinData {
    if (!this.data) {
      throw new Error(
        `Widget ${this.id} data not initialized. Call update() before render().`
      );
    }
    return this.data;
  }

  /**
   * Render widget output
   * @param context - Render context
   * @returns Rendered string, or null if widget should not display
   */
  abstract render(context: RenderContext): Promise<string | null>;

  /**
   * Optional cleanup method
   * Override if widget has resources to clean up
   */
  async cleanup?(): Promise<void>;
}
