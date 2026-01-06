/**
 * Unified rendering engine with error boundaries
 * Combines widget outputs into statusline
 */

import type { IWidget } from '#core/types.js';
import type { RenderContext } from '#types.js';
import { DEFAULTS } from '#constants.js';

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
   * Render widgets into a single line with error boundaries
   *
   * Widgets that throw errors are logged (via onError callback) and skipped,
   * allowing other widgets to continue rendering.
   *
   * @param widgets - Array of widgets to render
   * @param context - Render context with width and timestamp
   * @returns Combined widget outputs separated by separator
   */
  async render(widgets: IWidget[], context: RenderContext): Promise<string> {
    const outputs: string[] = [];

    for (const widget of widgets) {
      if (!widget.isEnabled()) {
        continue;
      }

      try {
        const output = await widget.render(context);
        if (output !== null) {
          outputs.push(output);
        }
      } catch (error) {
        // Log error but continue rendering other widgets
        this.handleError(error as Error, widget);

        // Optional: show error placeholder in output
        if (this.showErrors) {
          outputs.push(`${widget.id}:<err>`);
        }
      }
    }

    return outputs.join(this.separator);
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
