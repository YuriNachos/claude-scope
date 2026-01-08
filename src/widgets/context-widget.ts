/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IContextColors } from "../ui/theme/types.js";
import { colorize } from "../ui/utils/formatters.js";
import { contextStyles } from "./context/styles.js";
import type { ContextRenderData } from "./context/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

export class ContextWidget extends StdinDataWidget {
  readonly id = "context";
  readonly metadata = createWidgetMetadata(
    "Context",
    "Displays context window usage with progress bar",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private colors: IContextColors;
  private styleFn: StyleRendererFn<ContextRenderData> = contextStyles.balanced!;

  constructor(colors?: IContextColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.context;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = contextStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const { current_usage, context_window_size } = data.context_window;

    if (!current_usage) return null;

    // Calculate actual context usage:
    // - input_tokens: new tokens added to context
    // - cache_creation_input_tokens: tokens spent creating cache (also in context)
    // - cache_read_input_tokens: tokens read from cache (still occupy context space)
    // - output_tokens: tokens in the response (also part of context)
    const used =
      current_usage.input_tokens +
      current_usage.cache_creation_input_tokens +
      current_usage.cache_read_input_tokens +
      current_usage.output_tokens;

    const percent = Math.round((used / context_window_size) * 100);

    const renderData = {
      used,
      contextWindowSize: context_window_size,
      percent,
    };

    const output = this.styleFn(renderData);
    const color = this.getContextColor(percent);

    return colorize(output, color);
  }

  private getContextColor(percent: number): string {
    const clampedPercent = Math.max(0, Math.min(100, percent));

    if (clampedPercent < 50) {
      return this.colors.low;
    } else if (clampedPercent < 80) {
      return this.colors.medium;
    } else {
      return this.colors.high;
    }
  }
}
