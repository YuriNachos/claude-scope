#!/usr/bin/env node

/**
 * Claude Scope - Claude Code statusline plugin
 * Entry point
 */

import { parseCommand, routeCommand } from "./cli/index.js";
import { type LoadedConfig, loadWidgetConfig } from "./config/config-loader.js";
import { Renderer } from "./core/renderer.js";
import { isValidWidgetStyle, type WidgetStyle } from "./core/style-types.js";
import { WidgetFactory } from "./core/widget-factory.js";
import { WidgetRegistry } from "./core/widget-registry.js";
import { StdinProvider } from "./data/stdin-provider.js";

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

    // Load widget configuration
    const widgetConfig = await loadWidgetConfig();

    // Create widget factory
    const factory = new WidgetFactory();

    // Register widgets from config - config is the SINGLE SOURCE OF TRUTH
    if (widgetConfig) {
      for (const [_lineNum, widgets] of Object.entries(widgetConfig.lines)) {
        for (const widgetConfigItem of widgets) {
          const widget = factory.createWidget(widgetConfigItem.id);

          if (widget) {
            // Apply style and line from config
            applyWidgetConfig(widget, widgetConfigItem.id, widgetConfig);
            await registry.register(widget);
          }
          // If widget is null (unknown ID), skip it silently
        }
      }
    } else {
      // Fallback: if no config, register minimal default widgets
      const defaultWidgets = ["model", "git", "context"];
      for (const widgetId of defaultWidgets) {
        const widget = factory.createWidget(widgetId);
        if (widget) {
          await registry.register(widget);
        }
      }
    }

    // NOTE: No feature flags needed - config controls which widgets are shown
    // TranscriptProvider is now managed by WidgetFactory

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
    const factory = new WidgetFactory();
    const widget = factory.createWidget("git");

    if (!widget) {
      return "";
    }

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
