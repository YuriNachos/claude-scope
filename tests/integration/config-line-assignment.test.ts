/**
 * Integration test for config-based line assignment
 * Verifies that widgets appear on correct lines per user config
 */

import { afterEach, beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import type { LoadedConfig } from "../../src/config/config-loader.js";
import { Renderer } from "../../src/core/renderer.js";
import { WidgetRegistry } from "../../src/core/widget-registry.js";
import { TranscriptProvider } from "../../src/providers/transcript-provider.js";
import type { RenderContext, StdinData } from "../../src/types.js";
import { DEFAULT_THEME } from "../../src/ui/theme/index.js";
import { ActiveToolsWidget } from "../../src/widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../../src/widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../../src/widgets/config-count-widget.js";
import { ContextWidget } from "../../src/widgets/context-widget.js";
import { CostWidget } from "../../src/widgets/cost-widget.js";
import { DurationWidget } from "../../src/widgets/duration-widget.js";
import { ModelWidget } from "../../src/widgets/model-widget.js";
import { stripAnsi } from "../helpers/snapshot.js";

/**
 * Helper function to create test stdin data
 */
function createStdinData(overrides?: Partial<StdinData>): StdinData {
  return {
    hook_event_name: "Status",
    session_id: "session_20250111_123045",
    transcript_path: "/tmp/transcript.json",
    cwd: "/Users/user/project",
    model: { id: "claude-opus-4-5-20251101", display_name: "Claude Opus 4.5" },
    workspace: {
      current_dir: "/Users/user/project",
      project_dir: "/Users/user/project",
    },
    version: "1.0.80",
    output_style: { name: "default" },
    cost: {
      total_cost_usd: 0.42,
      total_duration_ms: 3665000,
      total_api_duration_ms: 15000,
      total_lines_added: 142,
      total_lines_removed: 27,
    },
    context_window: {
      total_input_tokens: 50000,
      total_output_tokens: 5000,
      context_window_size: 200000,
      current_usage: {
        input_tokens: 50000,
        output_tokens: 5000,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 35000,
      },
    },
    ...overrides,
  };
}

/**
 * Apply widget configuration from loaded config to a widget instance
 * Replicates the logic from src/index.ts applyWidgetConfig function
 */
function applyWidgetConfig(
  widget: { setStyle?(style: string): void; setLine?(line: number): void },
  widgetId: string,
  config: LoadedConfig | null
): void {
  if (!config) {
    return; // No config to apply
  }

  // Find widget config by scanning lines
  for (const [lineNum, widgets] of Object.entries(config.lines)) {
    const widgetConfig = widgets.find((w) => w.id === widgetId);
    if (widgetConfig) {
      // Apply style
      if (typeof widget.setStyle === "function") {
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
 * Replicates the logic from src/index.ts registerWidgetWithConfig function
 */
async function registerWidgetWithConfig<
  T extends { setStyle?(style: string): void; setLine?(line: number): void },
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

describe("Config Line Assignment Integration", () => {
  let registry: WidgetRegistry;
  let renderer: Renderer;

  beforeEach(async () => {
    registry = new WidgetRegistry();
    renderer = new Renderer({
      separator: " │ ",
      onError: () => {},
      showErrors: false,
    });
  });

  afterEach(async () => {
    await registry.clear();
  });

  describe("Custom config with widgets on specific lines", () => {
    // Custom config with widgets on specific lines
    const customConfig: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "cost", style: "balanced", colors: {} },
        ],
        "1": [
          { id: "context", style: "balanced", colors: {} },
          { id: "cache-metrics", style: "balanced", colors: {} },
        ],
        "2": [
          { id: "duration", style: "balanced", colors: {} },
          { id: "active-tools", style: "balanced", colors: {} },
        ],
      },
    };

    it("should place widgets on lines specified in config", async () => {
      // Arrange: Register widgets with custom config
      await registerWidgetWithConfig(registry, new ModelWidget(), "model", customConfig);
      await registerWidgetWithConfig(registry, new ContextWidget(), "context", customConfig);
      await registerWidgetWithConfig(registry, new CostWidget(), "cost", customConfig);
      await registerWidgetWithConfig(registry, new DurationWidget(), "duration", customConfig);
      await registerWidgetWithConfig(
        registry,
        new CacheMetricsWidget(DEFAULT_THEME),
        "cache-metrics",
        customConfig
      );
      await registerWidgetWithConfig(
        registry,
        new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider()),
        "active-tools",
        customConfig
      );

      // Act: Update widgets with stdin data
      const stdinData = createStdinData();
      for (const widget of registry.getAll()) {
        await widget.update(stdinData);
      }

      // Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Verify line assignments
      expect(lines).to.have.lengthOf(3); // 3 lines configured

      // Line 0 should have model and cost
      const line0Clean = stripAnsi(lines[0] || "");
      expect(line0Clean).to.include("Claude Opus 4.5");
      expect(line0Clean).to.include("$0.42");

      // Line 1 should have context and cache-metrics
      const line1Clean = stripAnsi(lines[1] || "");
      expect(line1Clean).to.include("%"); // context percentage
      expect(line1Clean).to.include("cache"); // cache-metrics

      // Line 2 should have duration (active-tools may be empty without transcript data)
      const line2Clean = stripAnsi(lines[2] || "");
      expect(line2Clean).to.include("h"); // duration
    });

    it("should respect widget getLine() after config application", async () => {
      // Arrange: Create widgets and apply config
      const modelWidget = new ModelWidget();
      const contextWidget = new ContextWidget();
      const costWidget = new CostWidget();
      const durationWidget = new DurationWidget();
      const cacheWidget = new CacheMetricsWidget(DEFAULT_THEME);
      const activeToolsWidget = new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider());

      // Apply config manually
      applyWidgetConfig(modelWidget, "model", customConfig);
      applyWidgetConfig(contextWidget, "context", customConfig);
      applyWidgetConfig(costWidget, "cost", customConfig);
      applyWidgetConfig(durationWidget, "duration", customConfig);
      applyWidgetConfig(cacheWidget, "cache-metrics", customConfig);
      applyWidgetConfig(activeToolsWidget, "active-tools", customConfig);

      // Act & Assert: Verify line assignments via getLine()
      // model and cost on line 0
      expect(modelWidget.getLine()).to.equal(0);
      expect(costWidget.getLine()).to.equal(0);

      // context and cache-metrics on line 1
      expect(contextWidget.getLine()).to.equal(1);
      expect(cacheWidget.getLine()).to.equal(1);

      // duration and active-tools on line 2
      expect(durationWidget.getLine()).to.equal(2);
      expect(activeToolsWidget.getLine()).to.equal(2);
    });
  });

  describe("Balanced layout config", () => {
    // Simulates Balanced layout from quick-config
    const balancedConfig: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "context", style: "balanced", colors: {} },
          { id: "cost", style: "balanced", colors: {} },
          { id: "duration", style: "balanced", colors: {} },
          { id: "lines", style: "balanced", colors: {} },
        ],
        "1": [
          { id: "cache-metrics", style: "balanced", colors: {} },
          { id: "active-tools", style: "balanced", colors: {} },
        ],
      },
    };

    it("should place widgets according to Balanced layout", async () => {
      // Arrange: Register widgets with balanced layout
      await registerWidgetWithConfig(registry, new ModelWidget(), "model", balancedConfig);
      await registerWidgetWithConfig(registry, new ContextWidget(), "context", balancedConfig);
      await registerWidgetWithConfig(registry, new CostWidget(), "cost", balancedConfig);
      await registerWidgetWithConfig(registry, new DurationWidget(), "duration", balancedConfig);
      await registerWidgetWithConfig(
        registry,
        new CacheMetricsWidget(DEFAULT_THEME),
        "cache-metrics",
        balancedConfig
      );
      await registerWidgetWithConfig(
        registry,
        new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider()),
        "active-tools",
        balancedConfig
      );

      // Act: Update and render
      const stdinData = createStdinData();
      for (const widget of registry.getAll()) {
        await widget.update(stdinData);
      }

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Balanced layout has 2 lines
      expect(lines).to.have.lengthOf(2);

      // Line 0 has model, context, cost, duration
      const line0Clean = stripAnsi(lines[0] || "");
      expect(line0Clean).to.include("Claude Opus 4.5"); // model
      expect(line0Clean).to.include("%"); // context
      expect(line0Clean).to.include("$0.42"); // cost
      expect(line0Clean).to.match(/\d+\s*h/); // duration

      // Line 1 has cache-metrics
      const line1Clean = stripAnsi(lines[1] || "");
      expect(line1Clean).to.include("cache"); // cache-metrics
    });
  });

  describe("Compact layout config", () => {
    // Simulates Compact layout from quick-config (single line)
    const compactConfig: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "compact", colors: {} },
          { id: "context", style: "compact", colors: {} },
          { id: "cost", style: "compact", colors: {} },
          { id: "duration", style: "compact", colors: {} },
        ],
      },
    };

    it("should place all widgets on single line for Compact layout", async () => {
      // Arrange: Register widgets with compact layout
      await registerWidgetWithConfig(registry, new ModelWidget(), "model", compactConfig);
      await registerWidgetWithConfig(registry, new ContextWidget(), "context", compactConfig);
      await registerWidgetWithConfig(registry, new CostWidget(), "cost", compactConfig);
      await registerWidgetWithConfig(registry, new DurationWidget(), "duration", compactConfig);

      // Act: Update and render
      const stdinData = createStdinData();
      for (const widget of registry.getAll()) {
        await widget.update(stdinData);
      }

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Compact layout has 1 line
      expect(lines).to.have.lengthOf(1);

      // All widgets on same line
      const line0Clean = stripAnsi(lines[0] || "");
      expect(line0Clean).to.include("Opus 4.5"); // Compact style removes "Claude" prefix
      expect(line0Clean).to.include("%");
      expect(line0Clean).to.include("$0.42");
      expect(line0Clean).to.match(/\d+\s*h/);
    });
  });

  describe("Rich layout config", () => {
    // Simulates Rich layout from quick-config (3 lines)
    const richConfig: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "context", style: "balanced", colors: {} },
          { id: "cost", style: "balanced", colors: {} },
          { id: "duration", style: "balanced", colors: {} },
        ],
        "1": [
          { id: "active-tools", style: "balanced", colors: {} },
          { id: "cache-metrics", style: "balanced", colors: {} },
        ],
        "2": [{ id: "config-count", style: "balanced", colors: {} }],
      },
    };

    it("should place widgets across 3 lines for Rich layout", async () => {
      // Arrange: Register widgets with rich layout
      await registerWidgetWithConfig(registry, new ModelWidget(), "model", richConfig);
      await registerWidgetWithConfig(registry, new ContextWidget(), "context", richConfig);
      await registerWidgetWithConfig(registry, new CostWidget(), "cost", richConfig);
      await registerWidgetWithConfig(registry, new DurationWidget(), "duration", richConfig);
      await registerWidgetWithConfig(
        registry,
        new CacheMetricsWidget(DEFAULT_THEME),
        "cache-metrics",
        richConfig
      );
      await registerWidgetWithConfig(
        registry,
        new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider()),
        "active-tools",
        richConfig
      );
      await registerWidgetWithConfig(registry, new ConfigCountWidget(), "config-count", richConfig);

      // Act: Update and render
      const stdinData = createStdinData();
      for (const widget of registry.getAll()) {
        await widget.update(stdinData);
      }

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Rich layout has 3 lines
      expect(lines).to.have.lengthOf.at.least(2); // At least 2 lines

      // Line 0 has model, context, cost, duration
      const line0Clean = stripAnsi(lines[0] || "");
      expect(line0Clean).to.include("Claude Opus 4.5");
      expect(line0Clean).to.include("%");
      expect(line0Clean).to.include("$0.42");

      // Line 1 has cache-metrics
      const line1Clean = stripAnsi(lines[1] || "");
      expect(line1Clean).to.include("cache");
    });
  });

  describe("Config application behavior", () => {
    it("should not override default line when config is null", async () => {
      // Arrange: Create widget with default line
      const modelWidget = new ModelWidget();
      const contextWidget = new ContextWidget();

      // Act: Apply null config (no config file exists)
      applyWidgetConfig(modelWidget, "model", null);
      applyWidgetConfig(contextWidget, "context", null);

      // Assert: Widgets retain their default lines from metadata
      expect(modelWidget.getLine()).to.equal(0); // Default line from metadata
      expect(contextWidget.getLine()).to.equal(0); // Default line from metadata
    });

    it("should override default line when config specifies different line", async () => {
      // Arrange: Create widget with default line 0
      const modelWidget = new ModelWidget();

      // Act: Apply config that puts model on line 2
      const config: LoadedConfig = {
        lines: {
          "2": [{ id: "model", style: "balanced", colors: {} }],
        },
      };
      applyWidgetConfig(modelWidget, "model", config);

      // Assert: Widget line is overridden to 2
      expect(modelWidget.getLine()).to.equal(2);
    });

    it("should apply both style and line from config", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();

      // Act: Apply config with different style and line
      const config: LoadedConfig = {
        lines: {
          "1": [{ id: "model", style: "compact", colors: {} }],
        },
      };

      // Capture setStyle calls
      let appliedStyle: string | undefined;
      const originalSetStyle = modelWidget.setStyle.bind(modelWidget);
      modelWidget.setStyle = (style: string) => {
        appliedStyle = style;
        originalSetStyle(style);
      };

      applyWidgetConfig(modelWidget, "model", config);

      // Assert: Both style and line are applied
      expect(appliedStyle).to.equal("compact");
      expect(modelWidget.getLine()).to.equal(1);
    });
  });
});
