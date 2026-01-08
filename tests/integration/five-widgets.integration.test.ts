/**
 * Integration tests for core widgets
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { Renderer } from "../../src/core/renderer.js";
import { WidgetRegistry } from "../../src/core/widget-registry.js";
import { ConfigCountWidget } from "../../src/widgets/config-count-widget.js";
import { ContextWidget } from "../../src/widgets/context-widget.js";
import { CostWidget } from "../../src/widgets/cost-widget.js";
import { DurationWidget } from "../../src/widgets/duration-widget.js";
import { LinesWidget } from "../../src/widgets/lines-widget.js";
import { ModelWidget } from "../../src/widgets/model-widget.js";
import { createMockStdinData } from "../fixtures/mock-data.js";
import { stripAnsi } from "../helpers/snapshot.js";

describe("Core Widgets Integration", () => {
  it("should render all widgets in single line with pipe separator", async () => {
    const registry = new WidgetRegistry();

    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new DurationWidget());
    await registry.register(new LinesWidget());
    await registry.register(new ConfigCountWidget());

    const renderer = new Renderer();
    renderer.setSeparator(" │ ");

    const mockData = createMockStdinData({
      model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      cost: {
        total_cost_usd: 0.0123,
        total_duration_ms: 330000,
        total_api_duration_ms: 15000,
        total_lines_added: 42,
        total_lines_removed: 10,
      },
    });
    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    const lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now(),
    });

    // Join for testing (simulates main() behavior)
    const output = lines.join("\n");
    const cleanOutput = stripAnsi(output);

    expect(lines).to.be.an("array");
    expect(cleanOutput).to.include("Opus 4.5");
    expect(cleanOutput).to.include("[");
    expect(cleanOutput).to.include("]");
    expect(cleanOutput).to.include("$0.01");
    expect(cleanOutput).to.include("5m 30s");
    expect(cleanOutput).to.include("+42");
    expect(cleanOutput).to.include("-10");
    expect(cleanOutput).to.include(" │ ");
  });

  it("should skip widgets that return null", async () => {
    const registry = new WidgetRegistry();

    await registry.register(new ModelWidget());

    const renderer = new Renderer();
    renderer.setSeparator(" │ ");

    const mockData = createMockStdinData({
      model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
    });
    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    const lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now(),
    });
    const output = lines.join("\n");

    expect(stripAnsi(output)).to.include("Opus 4.5");
  });

  it("should handle all widgets enabled by default", async () => {
    const registry = new WidgetRegistry();

    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new DurationWidget());
    await registry.register(new LinesWidget());
    await registry.register(new ConfigCountWidget());

    const enabledWidgets = registry.getEnabledWidgets();

    // ConfigCountWidget only shows if configs exist in HOME directory
    // In test environment, it may be disabled (isEnabled() returns false)
    // So we expect either 5 (no configs) or 6 (configs exist)
    expect(enabledWidgets.length).to.be.oneOf([5, 6]);
  });

  it("should respect widget disabled config", async () => {
    const registry = new WidgetRegistry();

    const costWidget = new CostWidget();
    await registry.register(costWidget);
    await costWidget.initialize({ config: { enabled: false } });

    const enabledWidgets = registry.getEnabledWidgets();

    expect(enabledWidgets).to.have.lengthOf(0);
  });

  it("should render in correct widget order", async () => {
    const registry = new WidgetRegistry();

    // Register in specific order
    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new LinesWidget());

    const renderer = new Renderer();
    renderer.setSeparator(" │ ");

    const mockData = createMockStdinData({
      model: { id: "claude-opus-4-5", display_name: "Opus 4.5" },
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 42,
        total_lines_removed: 10,
      },
    });
    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    const lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now(),
    });

    // Join for testing
    const output = lines.join("\n");
    const cleanOutput = stripAnsi(output);

    // Check order by finding positions
    const modelPos = cleanOutput.indexOf("Opus 4.5");
    const contextPos = cleanOutput.indexOf("[");
    const costPos = cleanOutput.indexOf("$0.01");
    const linesPos = cleanOutput.indexOf("+42");

    expect(modelPos).to.be.lessThan(contextPos);
    expect(contextPos).to.be.lessThan(costPos);
    expect(costPos).to.be.below(linesPos);
  });

  it("should handle updates to all widgets", async () => {
    const registry = new WidgetRegistry();

    await registry.register(new ModelWidget());
    await registry.register(new CostWidget());

    const renderer = new Renderer();
    renderer.setSeparator(" │ ");

    // First update
    let mockData = createMockStdinData({
      model: { id: "model-1", display_name: "Model 1" },
      cost: {
        total_cost_usd: 1.0,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0,
      },
    });

    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    let lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now(),
    });
    let output = lines.join("\n");
    const cleanOutput1 = stripAnsi(output);

    expect(cleanOutput1).to.include("Model 1");
    expect(cleanOutput1).to.include("$1.00");

    // Second update
    mockData = createMockStdinData({
      model: { id: "model-2", display_name: "Model 2" },
      cost: {
        total_cost_usd: 2.5,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0,
      },
    });

    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now(),
    });
    output = lines.join("\n");
    const cleanOutput2 = stripAnsi(output);

    expect(cleanOutput2).to.include("Model 2");
    expect(cleanOutput2).to.include("$2.50");
  });
});
