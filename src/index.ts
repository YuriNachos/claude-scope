#!/usr/bin/env node

/**
 * Claude Scope - Claude Code statusline plugin
 * Entry point
 */

import { parseCommand, routeCommand } from "./cli/index.js";
import { loadWidgetConfig } from "./config/config-loader.js";
import { formatConfigNagLine, writeConfigReport } from "./config/config-report.js";
import { Renderer } from "./core/renderer.js";
import { isValidWidgetStyle, type WidgetStyle } from "./core/style-types.js";
import { SUPPORTED_WIDGET_IDS, WidgetFactory } from "./core/widget-factory.js";
import { WidgetRegistry } from "./core/widget-registry.js";
import { StdinProvider } from "./data/stdin-provider.js";
import type { StdinData } from "./types.js";
import { getThemeByName } from "./ui/theme/index.js";

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
 * @param widgetConfig - Widget configuration item (id, style, colors, line)
 */
function applyWidgetConfig(
  widget: StyleableWidget & { setLine?(line: number): void },
  widgetConfig: { id: string; style: string; colors?: Record<string, string>; line?: number }
): void {
  // Apply style
  if (typeof widget.setStyle === "function" && isValidWidgetStyle(widgetConfig.style)) {
    widget.setStyle(widgetConfig.style);
  }

  // Apply line override if provided
  if (typeof widget.setLine === "function" && typeof widgetConfig.line === "number") {
    widget.setLine(widgetConfig.line);
  }
}

/**
 * Main entry point
 */
export async function main(): Promise<string> {
  try {
    // Check if we're in command mode
    const command = parseCommand();

    if (command === "quick-config" || command === "install") {
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

    // Load widget configuration. Always usable: an unreadable or unusable
    // config is quarantined and replaced rather than dropping the statusline
    // back to a hardcoded widget set with no explanation.
    const loaded = await loadWidgetConfig(SUPPORTED_WIDGET_IDS);

    // Record the diagnostics while the widgets render - nothing below reads
    // the result, so its I/O has no reason to sit on the critical path.
    const reportWritten = writeConfigReport(loaded.problems, loaded.quarantinedTo);

    // Create widget factory with theme from config (or default to monokai)
    const themeName = loaded.config.theme ?? "monokai";
    const themeColors = getThemeByName(themeName).colors;
    const factory = new WidgetFactory(themeColors);

    // Register widgets from config - config is the SINGLE SOURCE OF TRUTH.
    // Unknown ids were already dropped and reported by the loader.
    for (const [lineNum, widgets] of Object.entries(loaded.config.lines)) {
      for (const widgetConfigItem of widgets) {
        const widget = factory.createWidget(widgetConfigItem.id);

        if (widget) {
          // Apply style and line from config
          applyWidgetConfig(widget, {
            ...widgetConfigItem,
            line: parseInt(lineNum, 10),
          });
          await registry.register(widget, { config: { ...widgetConfigItem } });
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

    // While problems last, say so on screen - a statusline host discards
    // stderr, so anything reported only there is silence.
    await reportWritten;
    const nag = formatConfigNagLine(loaded.problems, loaded.quarantinedTo);
    if (nag) {
      lines.push(nag);
    }

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

    // Every StdinData field is optional in content but present as a key, so
    // the absent ones are spelled out rather than cast away with `any`.
    const fallbackData: StdinData = {
      hook_event_name: undefined,
      session_id: "fallback",
      transcript_path: undefined,
      cwd,
      model: undefined,
      workspace: undefined,
      version: undefined,
      output_style: undefined,
      cost: undefined,
      context_window: undefined,
    };
    await widget.update(fallbackData);

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
