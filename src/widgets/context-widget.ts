/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 * Uses UsageParser to read usage from transcript files when current_usage is null
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import { UsageParser } from "../providers/usage-parser.js";
import type { ContextUsage } from "../schemas/stdin-schema.js";
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
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<ContextRenderData, IContextColors> = contextStyles.balanced!;
  private cacheManager: CacheManager;
  private usageParser: UsageParser;
  private lastSessionId?: string;
  private cachedUsage?: ContextUsage | null; // Cache parsed usage within render cycle

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
    this.cacheManager = new CacheManager();
    this.usageParser = new UsageParser();
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = contextStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  /**
   * Update widget with new data, storing valid values in cache
   */
  async update(data: StdinData): Promise<void> {
    await super.update(data);

    const contextWindow = data.context_window;
    if (!contextWindow) {
      return;
    }

    // Detect session change: if session_id changed, we're in a new session
    // This ensures that when user presses /new, the widget doesn't cache old session's data
    const sessionId = data.session_id;
    const sessionChanged = this.lastSessionId && this.lastSessionId !== sessionId;
    this.lastSessionId = sessionId;

    const { current_usage } = contextWindow;

    // If we have valid current_usage, cache it
    // Only cache if ANY token value > 0. This prevents zero values from
    // overwriting valid cache data. ContextWidget tracks ALL token types
    // (input, output, cache_read, cache_creation), so a valid state could
    // have zero input_tokens but non-zero output_tokens or cache_read_tokens.
    //
    // IMPORTANT: Skip caching if we just detected a session change. This prevents
    // old session data (which may come with the new session_id) from being cached
    // under the new session ID.
    if (current_usage && !sessionChanged && sessionId) {
      const hasAnyTokens =
        (current_usage.input_tokens ?? 0) > 0 ||
        (current_usage.output_tokens ?? 0) > 0 ||
        (current_usage.cache_creation_input_tokens ?? 0) > 0 ||
        (current_usage.cache_read_input_tokens ?? 0) > 0;

      if (hasAnyTokens) {
        this.cacheManager.setCachedUsage(sessionId, {
          input_tokens: current_usage.input_tokens,
          output_tokens: current_usage.output_tokens,
          cache_creation_input_tokens: current_usage.cache_creation_input_tokens,
          cache_read_input_tokens: current_usage.cache_read_input_tokens,
        });
      }
    }

    // Parse usage from transcript for use in render (done once per update)
    // Priority 1: current_usage (checked in renderWithData)
    // Priority 2: transcript file (persists during tool execution)
    // Priority 3: cache manager (5-min cache)
    const hasRealUsage =
      current_usage &&
      ((current_usage.input_tokens ?? 0) > 0 ||
        (current_usage.output_tokens ?? 0) > 0 ||
        (current_usage.cache_read_input_tokens ?? 0) > 0 ||
        (current_usage.cache_creation_input_tokens ?? 0) > 0);

    if (!current_usage || !hasRealUsage) {
      // current_usage is null or all zeros - try transcript
      const transcriptPath = data.transcript_path;
      if (transcriptPath) {
        this.cachedUsage = await this.usageParser.parseLastUsage(transcriptPath);
      }
    } else {
      // current_usage has real data - clear cached transcript usage
      this.cachedUsage = undefined;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const contextWindow = data.context_window || ({} as any);
    const current_usage = contextWindow.current_usage;
    const context_window_size = contextWindow.context_window_size;

    // Priority 0: Use Claude Code's pre-calculated percentage if available
    const used_percentage = contextWindow.used_percentage;
    if (used_percentage !== undefined) {
      const renderData = {
        used: 0, // Will be calculated from percentage
        contextWindowSize: context_window_size || 200000,
        percent: Math.round(used_percentage),
      };
      return this.styleFn(renderData, this.colors.context);
    }

    // Priority 1: current_usage from stdin (fastest, most recent)
    let usage = current_usage;

    // Check if current_usage has real data (not all zeros)
    const hasRealUsage =
      usage &&
      ((usage.input_tokens ?? 0) > 0 ||
        (usage.output_tokens ?? 0) > 0 ||
        (usage.cache_read_input_tokens ?? 0) > 0 ||
        (usage.cache_creation_input_tokens ?? 0) > 0);

    // Priority 2: usage parsed from transcript (persists during tool execution)
    // Use transcript if current_usage is null or has no real data
    if ((!usage || !hasRealUsage) && this.cachedUsage) {
      usage = this.cachedUsage;
    }

    // Priority 3: cache manager (5-min cache)
    if (!usage && data.session_id) {
      const cached = this.cacheManager.getCachedUsage(data.session_id);
      if (cached) {
        usage = cached.usage;
      }
    }

    // Default context window size if not provided
    const ctxSize = context_window_size || 200000;

    // If no usage data available, show zeros by default (widget should always be visible)
    if (!usage) {
      const renderData = {
        used: 0,
        contextWindowSize: ctxSize,
        percent: 0,
      };
      return this.styleFn(renderData, this.colors.context);
    }

    // Calculate actual context usage (ccstatusline approach):
    // - input_tokens: new tokens added to context
    // - cache_creation_input_tokens: tokens spent creating cache (also in context)
    // - cache_read_input_tokens: tokens read from cache (still occupy context space)
    // NOTE: output_tokens NOT included (they become input tokens in next message)
    const used =
      (usage.input_tokens || 0) +
      (usage.cache_creation_input_tokens || 0) +
      (usage.cache_read_input_tokens || 0);

    const percent = Math.round((used / ctxSize) * 100);

    const renderData = {
      used,
      contextWindowSize: ctxSize,
      percent,
    };

    // Style functions now handle colorization based on percent
    return this.styleFn(renderData, this.colors.context);
  }

  isEnabled(): boolean {
    return true;
  }
}
