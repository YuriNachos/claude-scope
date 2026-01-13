/**
 * Unified rendering engine with error boundaries
 * Combines widget outputs into statusline
 */

import { DEFAULTS } from "../constants.js";
import type { RenderContext } from "../types.js";
import type { IWidget } from "./types.js";

/**
 * Renderer configuration options
 */
export interface RendererOptions {
  /** Separator between widget outputs */
  separator?: string;
  /** Error handler callback for widget render failures */
  onError?: (error: Error, widget: IWidget) => void;
  /** Show error placeholder in output (for debugging) */
  showErrors?: boolean;
}

/**
 * Renderer for combining widget outputs with error boundaries
 *
 * Failed widgets are gracefully skipped, preventing single widget
 * failures from breaking the entire statusline.
 */
export class Renderer {
  private separator: string;
  private onError?: (error: Error, widget: IWidget) => void;
  private showErrors: boolean;

  constructor(options: RendererOptions = {}) {
    this.separator = options.separator ?? DEFAULTS.SEPARATOR;
    this.onError = options.onError;
    this.showErrors = options.showErrors ?? false;
  }

  /**
   * Render widgets into multiple lines with error boundaries
   *
   * Widgets are grouped by their metadata.line property and rendered
   * on separate lines. Widgets that throw errors are logged (via onError
   * callback) and skipped, allowing other widgets to continue rendering.
   *
   * Empty lines are preserved to maintain correct line positioning.
   *
   * @param widgets - Array of widgets to render
   * @param context - Render context with width and timestamp
   * @returns Array of rendered lines (one per line number)
   */
  async render(widgets: IWidget[], context: RenderContext): Promise<string[]> {
    // Group widgets by line
    const lineMap = new Map<number, IWidget[]>();

    for (const widget of widgets) {
      if (!widget.isEnabled()) {
        continue;
      }

      const line = widget.getLine ? widget.getLine() : (widget.metadata.line ?? 0);
      if (!lineMap.has(line)) {
        lineMap.set(line, []);
      }
      lineMap.get(line)?.push(widget);
    }

    // Render each line - use Map to preserve line numbers
    const lineOutputs = new Map<number, string>();
    const sortedLines = Array.from(lineMap.entries()).sort((a, b) => a[0] - b[0]);

    for (const [lineNum, widgetsForLine] of sortedLines) {
      const outputs: string[] = [];

      for (const widget of widgetsForLine) {
        try {
          const output = await widget.render(context);
          // Filter out null and empty strings to avoid leading separators
          if (output && output.trim().length > 0) {
            outputs.push(output);
          }
        } catch (error) {
          this.handleError(error as Error, widget);
          if (this.showErrors) {
            outputs.push(`${widget.id}:<err>`);
          }
        }
      }

      const line = outputs.join(this.separator);
      // Always store line output (even if empty) to preserve line numbering
      lineOutputs.set(lineNum, line);
    }

    // Convert Map to sorted array - this preserves line numbers
    // Empty lines are included to maintain correct positioning
    const sortedEntries = Array.from(lineOutputs.entries()).sort((a, b) => a[0] - b[0]);
    const lines = sortedEntries.map(([, output]) => output);

    return lines;
  }

  /**
   * Set custom separator
   */
  setSeparator(separator: string): void {
    this.separator = separator;
  }

  /**
   * Handle widget render errors
   *
   * Calls the onError callback if provided, otherwise logs to console.warn
   */
  private handleError(error: Error, widget: IWidget): void {
    if (this.onError) {
      this.onError(error, widget);
    } else {
      // Default: silent fail with console.warn
      console.warn(`[Widget ${widget.id}] ${error.message}`);
    }
  }
}
