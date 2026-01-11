#!/usr/bin/env node

/**
 * Claude Scope - Claude Code statusline plugin
 * Entry point
 */

import { parseCommand, routeCommand } from "./cli/index.js";
import { type LoadedConfig, loadWidgetConfig } from "./config/config-loader.js";
import { isWidgetEnabled } from "./config/widget-flags.js";
import { Renderer } from "./core/renderer.js";
import { isValidWidgetStyle, type WidgetStyle } from "./core/style-types.js";
import { WidgetRegistry } from "./core/widget-registry.js";
import { StdinProvider } from "./data/stdin-provider.js";
import { TranscriptProvider } from "./providers/transcript-provider.js";
import { DEFAULT_THEME } from "./ui/theme/index.js";
import { ActiveToolsWidget } from "./widgets/active-tools/index.js";
import { CacheMetricsWidget } from "./widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "./widgets/config-count-widget.js";
import { ContextWidget } from "./widgets/context-widget.js";
import { CostWidget } from "./widgets/cost-widget.js";
import { DurationWidget } from "./widgets/duration-widget.js";
import { EmptyLineWidget } from "./widgets/empty-line-widget.js";
import { GitTagWidget } from "./widgets/git/git-tag-widget.js";
import { GitWidget } from "./widgets/git/git-widget.js";
import { LinesWidget } from "./widgets/lines-widget.js";
import { ModelWidget } from "./widgets/model-widget.js";
import { PokerWidget } from "./widgets/poker-widget.js";

/**
 * Read stdin as string
 */
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Type for widgets that support optional style configuration
 */
type StyleableWidget = { setStyle?(style: WidgetStyle): void };

/**
 * Apply widget configuration from loaded config to a widget instance
 * @param widget - Widget instance to configure
 * @param widgetId - Widget identifier (e.g., "model", "git", "context")
 * @param config - Loaded configuration object
 */
function applyWidgetConfig(
  widget: StyleableWidget & { setLine?(line: number): void },
  widgetId: string,
  config: LoadedConfig
): void {
  // Find widget config by scanning lines
  for (const [lineNum, widgets] of Object.entries(config.lines)) {
    const widgetConfig = widgets.find((w) => w.id === widgetId);
    if (widgetConfig) {
      // Apply style
      if (typeof widget.setStyle === "function" && isValidWidgetStyle(widgetConfig.style)) {
        widget.setStyle(widgetConfig.style);
      }

      // Apply line override
      if (typeof widget.setLine === "function") {
        widget.setLine(parseInt(lineNum, 10));
      }

      break;
    }
  }
}

/**
 * Register a widget with the registry, applying configuration if available
 * @param registry - Widget registry instance
 * @param widget - Widget instance to register (must be IWidget)
 * @param widgetId - Widget identifier for config lookup
 * @param config - Loaded configuration object (null if no config)
 *
 * @description This helper function applies style configuration to a widget
 * before registering it with the widget registry. The widget must implement IWidget
 * and optionally support setStyle() for configuration.
 */
async function registerWidgetWithConfig<
  T extends { setStyle?(style: WidgetStyle): void; setLine?(line: number): void },
>(
  registry: WidgetRegistry,
  widget: T & Parameters<WidgetRegistry["register"]>[0],
  widgetId: string,
  config: LoadedConfig | null
): Promise<void> {
  if (config) {
    applyWidgetConfig(widget, widgetId, config);
  }
  await registry.register(widget);
}

/**
 * Main entry point
 */
export async function main(): Promise<string> {
  try {
    // Check if we're in command mode
    const command = parseCommand();

    if (command === "quick-config") {
      await routeCommand(command);
      return ""; // Commands handle their own output
    }

    // Read JSON from stdin
    const stdin = await readStdin();

    // If stdin is empty, still try to show git info
    if (!stdin || stdin.trim().length === 0) {
      const fallback = await tryGitFallback();
      return fallback;
    }

    // Parse and validate with StdinProvider
    const provider = new StdinProvider();
    const stdinData = await provider.parse(stdin);

    // Create registry
    const registry = new WidgetRegistry();

    // Create transcript provider for ActiveToolsWidget
    const transcriptProvider = new TranscriptProvider();

    // Load widget configuration
    const widgetConfig = await loadWidgetConfig();

    // Register all widgets with configuration applied
    await registerWidgetWithConfig(registry, new ModelWidget(), "model", widgetConfig);
    await registerWidgetWithConfig(registry, new ContextWidget(), "context", widgetConfig);
    await registerWidgetWithConfig(registry, new CostWidget(), "cost", widgetConfig);
    await registerWidgetWithConfig(registry, new LinesWidget(), "lines", widgetConfig);
    await registerWidgetWithConfig(registry, new DurationWidget(), "duration", widgetConfig);
    await registerWidgetWithConfig(registry, new GitWidget(), "git", widgetConfig);
    await registerWidgetWithConfig(registry, new GitTagWidget(), "git-tag", widgetConfig);
    await registerWidgetWithConfig(registry, new ConfigCountWidget(), "config-count", widgetConfig);

    // Register feature-flagged widgets
    if (isWidgetEnabled("cacheMetrics")) {
      await registerWidgetWithConfig(
        registry,
        new CacheMetricsWidget(DEFAULT_THEME),
        "cache-metrics",
        widgetConfig
      );
    }

    if (isWidgetEnabled("activeTools")) {
      await registerWidgetWithConfig(
        registry,
        new ActiveToolsWidget(DEFAULT_THEME, transcriptProvider),
        "active-tools",
        widgetConfig
      );
    }

    // Poker widget is NOT in the config (excluded from quick-config)
    await registry.register(new PokerWidget());
    await registry.register(new EmptyLineWidget());

    // Create renderer with error handling configuration
    const renderer = new Renderer({
      separator: " │ ",
      onError: (_error, _widget) => {
        // Silently ignore widget errors - they return null
      },
      showErrors: false,
    });

    // Update all widgets with data
    for (const widget of registry.getAll()) {
      await widget.update(stdinData);
    }

    // Render (now returns array of lines)
    const lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now(),
    });

    // Join with newline
    return lines.join("\n");
  } catch (_error) {
    // Try to show at least git info on error
    const fallback = await tryGitFallback();
    return fallback;
  }
}

/**
 * Fallback: try to show at least git info when stdin parsing fails
 */
async function tryGitFallback(): Promise<string> {
  try {
    const cwd = process.cwd();

    const widget = new GitWidget();
    await widget.initialize({ config: {} });
    await widget.update({ cwd, session_id: "fallback" } as any);

    const result = await widget.render({ width: 80, timestamp: Date.now() });
    return result || "";
  } catch {
    return "";
  }
}

// Run when executed (works with both direct node and npx)
main()
  .then((output) => {
    if (output) {
      console.log(output);
    }
  })
  .catch(() => {
    // Silently fail - return empty status line
    process.exit(0);
  });
