/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 * Uses cached values when current_usage is null to prevent flickering
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import { CacheManager } from "../storage/cache-manager.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IContextColors, IThemeColors } from "../ui/theme/types.js";
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

  private colors: IThemeColors;
  private styleFn: StyleRendererFn<ContextRenderData, IContextColors> = contextStyles.balanced!;
  private cacheManager: CacheManager;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
    this.cacheManager = new CacheManager();
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = contextStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  /**
   * Update widget with new data, storing valid values in cache
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    const { current_usage } = data.context_window;

    // If we have valid current_usage, cache it
    // Only cache if ANY token value > 0. This prevents zero values from
    // overwriting valid cache data. ContextWidget tracks ALL token types
    // (input, output, cache_read, cache_creation), so a valid state could
    // have zero input_tokens but non-zero output_tokens or cache_read_tokens.
    if (current_usage) {
      const hasAnyTokens =
        (current_usage.input_tokens ?? 0) > 0 ||
        (current_usage.output_tokens ?? 0) > 0 ||
        (current_usage.cache_creation_input_tokens ?? 0) > 0 ||
        (current_usage.cache_read_input_tokens ?? 0) > 0;

      if (hasAnyTokens) {
        this.cacheManager.setCachedUsage(data.session_id, {
          input_tokens: current_usage.input_tokens,
          output_tokens: current_usage.output_tokens,
          cache_creation_input_tokens: current_usage.cache_creation_input_tokens,
          cache_read_input_tokens: current_usage.cache_read_input_tokens,
        });
      }
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const { current_usage, context_window_size } = data.context_window;

    // Try to get usage data: prefer current, fall back to cache
    let usage = current_usage;
    if (!usage) {
      const cached = this.cacheManager.getCachedUsage(data.session_id);
      if (cached) {
        usage = cached.usage;
      }
    }

    if (!usage) return null;

    // Calculate actual context usage:
    // - input_tokens: new tokens added to context
    // - cache_creation_input_tokens: tokens spent creating cache (also in context)
    // - cache_read_input_tokens: tokens read from cache (still occupy context space)
    // - output_tokens: tokens in the response (also part of context)
    const used =
      usage.input_tokens +
      usage.cache_creation_input_tokens +
      usage.cache_read_input_tokens +
      usage.output_tokens;

    const percent = Math.round((used / context_window_size) * 100);

    const renderData = {
      used,
      contextWindowSize: context_window_size,
      percent,
    };

    // Style functions now handle colorization based on percent
    return this.styleFn(renderData, this.colors.context);
  }

  isEnabled(): boolean {
    return true;
  }
}
