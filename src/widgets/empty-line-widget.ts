/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import type { RenderContext, StdinData } from '../types.js';

export class EmptyLineWidget extends StdinDataWidget {
  readonly id = 'empty-line';
  readonly metadata = createWidgetMetadata(
    'Empty Line',
    'Empty line separator',
    '1.0.0',
    'claude-scope',
    3  // Fourth line (0-indexed)
  );

  /**
   * Return a single space to create a blank separator line.
   * Using a space character instead of empty string ensures the line is visible.
   */
  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    return ' ';
  }
}
