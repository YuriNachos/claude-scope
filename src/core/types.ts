/**
 * Core types for the widget system
 */

import type { StdinData, RenderContext } from '../types.js';

/**
 * Widget metadata describing the widget
 */
export interface IWidgetMetadata {
  name: string;
  description: string;
  version: string;
  author: string;
  /** Which statusline line this widget appears on (0-indexed) */
  line?: number;
}

/**
 * Initialization context passed to widgets
 */
export interface WidgetContext {
  config: Record<string, unknown>;
}

/**
 * Interface that all widgets must implement
 */
export interface IWidget {
  /** Unique widget identifier */
  readonly id: string;

  /** Widget metadata */
  readonly metadata: IWidgetMetadata;

  /**
   * Initialize the widget with context
   * Called once when widget is registered
   */
  initialize(context: WidgetContext): Promise<void>;

  /**
   * Render the widget output
   * Called on each update cycle
   * @returns String to render, or null if widget should not display
   */
  render(context: RenderContext): Promise<string | null>;

  /**
   * Update widget with new data
   * Called when new stdin data arrives
   */
  update(data: StdinData): Promise<void>;

  /**
   * Check if widget is enabled
   * Widget only renders if enabled
   */
  isEnabled(): boolean;

  /**
   * Cleanup resources
   * Optional - called when widget is unregistered
   */
  cleanup?(): Promise<void>;
}

// Re-export shared types for widget convenience
// Widgets can import everything from core/types.js as their primary entry point
export type { StdinData, RenderContext };
