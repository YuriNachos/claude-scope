/**
 * Integration test for complete CLI flow
 * Tests stdin -> parse -> widget -> output
 */

import { afterEach, beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import { Renderer } from "../../src/core/renderer.js";
import { WidgetRegistry } from "../../src/core/widget-registry.js";
import type { RenderContext, StdinData } from "../../src/types.js";
import { DEFAULT_THEME } from "../../src/ui/theme/index.js";
import { CacheMetricsWidget } from "../../src/widgets/cache-metrics/cache-metrics-widget.js";
import { ConfigCountWidget } from "../../src/widgets/config-count-widget.js";
import { ContextWidget } from "../../src/widgets/context-widget.js";
import { CostWidget } from "../../src/widgets/cost-widget.js";
import { DurationWidget } from "../../src/widgets/duration-widget.js";
import { ModelWidget } from "../../src/widgets/model-widget.js";
import { stripAnsi } from "../helpers/snapshot.js";

function createStdinData(overrides?: Partial<StdinData>): StdinData {
  return {
    hook_event_name: "Status",
    session_id: "session_20250105_123045",
    transcript_path: "/tmp/transcript.json",
    cwd: process.cwd(),
    model: { id: "claude-opus-4-5-20251101", display_name: "Claude Opus 4.5" },
    workspace: {
      current_dir: process.cwd(),
      project_dir: process.cwd(),
    },
    version: "1.0.80",
    output_style: { name: "default" },
    cost: {
      total_cost_usd: 0.0123,
      total_duration_ms: 330000,
      total_api_duration_ms: 15000,
      total_lines_added: 42,
      total_lines_removed: 10,
    },
    context_window: {
      total_input_tokens: 15234,
      total_output_tokens: 4521,
      context_window_size: 200000,
      current_usage: {
        input_tokens: 8500,
        output_tokens: 1200,
        cache_creation_input_tokens: 5000,
        cache_read_input_tokens: 2000,
      },
    },
    ...overrides,
  };
}

describe("CLI Flow Integration", () => {
  let registry: WidgetRegistry;
  let renderer: Renderer;

  beforeEach(async () => {
    registry = new WidgetRegistry();
    renderer = new Renderer();
  });

  afterEach(async () => {
    await registry.clear();
  });

  describe("Complete flow with valid stdin data", () => {
    it("should process stdin data and render widgets", async () => {
      // Arrange: Create widgets
      const modelWidget = new ModelWidget();
      const contextWidget = new ContextWidget();
      const costWidget = new CostWidget();
      const durationWidget = new DurationWidget();
      const configCountWidget = new ConfigCountWidget();

      // Register widgets
      await registry.register(modelWidget);
      await registry.register(contextWidget);
      await registry.register(costWidget);
      await registry.register(durationWidget);
      await registry.register(configCountWidget);

      // Act: Simulate stdin data flow
      const stdinData = createStdinData();

      // Update all widgets with stdin data
      for (const widget of registry.getAll()) {
        await widget.update(stdinData);
      }

      // Render output
      const renderContext: RenderContext = {
        width: 80,
        timestamp: Date.now(),
      };

      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Join lines for testing (simulates main() behavior)
      const output = lines.join("\n");

      // Assert: Output contains widget data
      const cleanOutput = stripAnsi(output);
      expect(lines).to.be.an("array");
      expect(cleanOutput).to.include("Claude Opus 4.5");
      expect(cleanOutput).to.include("$0.01");
    });

    it("should filter out disabled widgets", async () => {
      // Arrange: Create widget but disable it
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget);
      await modelWidget.initialize({ config: { enabled: false } });

      // Act: Update widget
      const stdinData = createStdinData();
      await modelWidget.update(stdinData);

      // Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: No output (widget disabled)
      expect(lines).to.deep.equal([]);
    });
  });

  describe("Integration between components", () => {
    it("should initialize widget through registry", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();

      // Act: Register widget with initialization context
      await registry.register(modelWidget, {
        config: { enabled: true, customOption: "value" },
      });

      // Assert: Widget is registered and enabled
      expect(registry.has("model")).to.be.true;
      expect(modelWidget.isEnabled()).to.be.true;
      expect(registry.getEnabledWidgets()).to.have.length(1);
    });

    it("should update widget state with new stdin data", async () => {
      // Arrange: Create and register widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Update with initial data
      const stdinData1 = createStdinData({
        model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      });
      await modelWidget.update(stdinData1);

      // Update with new data
      const stdinData2 = createStdinData({
        model: { id: "claude-sonnet-4-5", display_name: "Sonnet 4.5" },
      });
      await modelWidget.update(stdinData2);

      // Assert: Widget processes both updates
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await modelWidget.render(renderContext);

      expect(stripAnsi(output || "")).to.include("Sonnet 4.5");
    });

    it("should cleanup widget when unregistered", async () => {
      // Arrange: Create and register widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Unregister widget
      await registry.unregister("model");

      // Assert: Widget removed from registry
      expect(registry.has("model")).to.be.false;
      expect(registry.getAll()).to.have.length(0);
    });
  });

  describe("Output format verification", () => {
    it("should render output with default separator", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Update and render output
      const stdinData = createStdinData({
        model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      });
      await modelWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);
      const output = lines.join("\n");

      // Assert: Output contains model name
      const cleanOutput = stripAnsi(output);
      expect(cleanOutput).to.include("Opus 4.5");
      expect(lines).to.be.an("array");
    });

    it("should render output with custom separator", async () => {
      // Arrange: Create renderer with custom separator
      const customRenderer = new Renderer();
      customRenderer.setSeparator(" | ");

      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Render with custom separator
      const stdinData = createStdinData({
        model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      });
      await modelWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await customRenderer.render(registry.getEnabledWidgets(), renderContext);
      const output = lines.join("\n");

      // Assert: Output contains model
      expect(stripAnsi(output)).to.include("Opus 4.5");
    });

    it("should handle null widget output", async () => {
      // Arrange: Create cost widget with no cost data
      const costWidget = new CostWidget();
      await registry.register(costWidget, { config: { enabled: true } });

      // Act: Render with no cost data
      const stdinData = createStdinData({ cost: undefined as any });
      await costWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const widgetOutput = await costWidget.render(renderContext);
      expect(widgetOutput).to.be.null;

      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Empty line is preserved to maintain line numbering
      expect(lines).to.deep.equal([""]);
    });
  });

  describe("Error handling for invalid input", () => {
    it("should handle missing cwd in stdin data", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Update with empty cwd
      const stdinData = createStdinData({ cwd: "" });

      // Should not throw
      await modelWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await modelWidget.render(renderContext);

      // Assert: Handles gracefully
      expect(output).to.not.be.undefined;
    });

    it("should allow duplicate widget registration", async () => {
      // Arrange: Create two widgets with same id
      const widget1 = new ModelWidget();
      const widget2 = new ModelWidget();

      // Act: Register both widgets
      await registry.register(widget1, { config: { enabled: true } });
      await registry.register(widget2, { config: { enabled: true } });

      // Assert: Both widgets are registered
      const all = registry.getAll();
      expect(all).to.have.length(2);
      expect(all[0].id).to.equal("model");
      expect(all[1].id).to.equal("model");
    });

    it("should handle unregistering non-existent widget", async () => {
      // Act: Try to unregister widget that doesn't exist
      // Should not throw
      await registry.unregister("non-existent");

      // Assert: Registry remains empty
      expect(registry.getAll()).to.have.length(0);
    });
  });

  describe("End-to-end scenarios", () => {
    it("should complete full workflow: register -> update -> render -> cleanup", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();

      // Step 1: Register widget
      await registry.register(modelWidget, { config: { enabled: true } });
      expect(registry.has("model")).to.be.true;

      // Step 2: Update with stdin data
      const stdinData = createStdinData({
        model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      });
      await modelWidget.update(stdinData);

      // Step 3: Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);
      const output = lines.join("\n");
      expect(stripAnsi(output)).to.include("Opus 4.5");

      // Step 4: Cleanup
      await registry.unregister("model");
      expect(registry.has("model")).to.be.false;
    });

    it("should handle rapid stdin data updates", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Simulate rapid updates
      const updates = [
        createStdinData({ session_id: "session_001" }),
        createStdinData({ session_id: "session_002" }),
        createStdinData({ session_id: "session_003" }),
      ];

      for (const data of updates) {
        await modelWidget.update(data);
      }

      // Assert: Widget handles all updates
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await modelWidget.render(renderContext);
      expect(stripAnsi(output || "")).to.include("Claude Opus 4.5");
    });

    it("should handle multiple render cycles", async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      const stdinData = createStdinData({
        model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      });
      await modelWidget.update(stdinData);

      // Act: Render multiple times
      const outputs: string[] = [];
      for (let i = 0; i < 3; i++) {
        const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
        const lines = await renderer.render(registry.getEnabledWidgets(), renderContext);
        outputs.push(lines.join("\n"));
      }

      // Assert: All renders succeed
      outputs.forEach((output) => {
        expect(stripAnsi(output)).to.include("Opus 4.5");
      });
    });
  });

  describe("Session change flow", () => {
    it("should handle session changes correctly", async () => {
      const registry = new WidgetRegistry();

      const contextWidget = new ContextWidget();
      const cacheWidget = new CacheMetricsWidget(DEFAULT_THEME);

      await registry.register(contextWidget);
      await registry.register(cacheWidget);

      const renderer = new Renderer({
        separator: " │ ",
        onError: () => {},
        showErrors: false,
      });

      // First session with data
      const data1 = createStdinData({
        session_id: "session-1",
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 50000,
            output_tokens: 5000,
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 30000,
          },
        },
      });

      for (const widget of registry.getAll()) {
        await widget.update(data1);
      }

      const output1 = await renderer.render(registry.getEnabledWidgets(), {
        width: 80,
        timestamp: 0,
      });

      // Should show context and cache
      expect(output1.join("\n")).to.include("43%"); // (50000+5000+30000)/200000 = 42.5% -> rounds to 43%
      expect(output1.join("\n")).to.include("30k");

      // Second session with null current_usage
      const data2 = createStdinData({
        session_id: "session-2", // Different session!
        context_window: {
          total_input_tokens: 0,
          total_output_tokens: 0,
          context_window_size: 200000,
          current_usage: null,
        },
      });

      for (const widget of registry.getAll()) {
        await widget.update(data2);
      }

      const output2 = await renderer.render(registry.getEnabledWidgets(), {
        width: 80,
        timestamp: 0,
      });

      // Should NOT show old context or cache data
      expect(output2.join("\n")).to.not.include("43%");
      expect(output2.join("\n")).to.not.include("30k");
    });
  });
});
