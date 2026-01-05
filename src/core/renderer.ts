/**
 * Unified rendering engine
 * Combines widget outputs into statusline
 */

import type { IWidget, RenderContext } from './types.js';

/**
 * Renderer for combining widget outputs
 */
export class Renderer {
  private separator = ' ';

  /**
   * Render widgets into a single line
   */
  async render(widgets: IWidget[], context: RenderContext): Promise<string> {
    const outputs: string[] = [];

    for (const widget of widgets) {
      if (!widget.isEnabled()) {
        continue;
      }

      const output = await widget.render(context);
      if (output !== null) {
        outputs.push(output);
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
}
