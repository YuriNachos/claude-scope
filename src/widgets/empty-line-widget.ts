/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */

import type { WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

export class EmptyLineWidget extends StdinDataWidget {
  readonly id = "empty-line";
  readonly metadata = createWidgetMetadata(
    "Empty Line",
    "Empty line separator",
    "1.0.0",
    "claude-scope",
    3 // Fourth line (0-indexed)
  );

  /**
   * All styles return the same value (Braille Pattern Blank).
   * This method exists for API consistency with other widgets.
   */
  setStyle(_style: WidgetStyle): void {
    // No-op - all styles return the same value
  }

  /**
   * Return Braille Pattern Blank to create a visible empty separator line.
   * U+2800 occupies cell width but appears blank, ensuring the line renders.
   */
  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    return "\u2800"; // Braille Pattern Blank - looks empty but takes space
  }
}
