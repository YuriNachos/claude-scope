import { describe, it } from "node:test";
import { expect } from "chai";
import type { LoadedConfig } from "../../src/config/config-loader.js";
import { WidgetFactory } from "../../src/core/widget-factory.js";
import { WidgetRegistry } from "../../src/core/widget-registry.js";

/**
 * Apply widget configuration from loaded config to a widget instance
 * Replicates the logic from src/index.ts
 */
function applyWidgetConfig(
  widget: { setStyle?(style: string): void; setLine?(line: number): void },
  widgetId: string,
  config: LoadedConfig
): void {
  for (const [lineNum, widgets] of Object.entries(config.lines)) {
    const widgetConfig = widgets.find((w) => w.id === widgetId);
    if (widgetConfig) {
      if (typeof widget.setStyle === "function") {
        widget.setStyle(widgetConfig.style);
      }
      if (typeof widget.setLine === "function") {
        widget.setLine(parseInt(lineNum, 10));
      }
      break;
    }
  }
}

describe("Config-Driven Widget Registration", () => {
  it("should register ONLY widgets that exist in config", async () => {
    // Config with ONLY model and cost widgets
    const config: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "cost", style: "balanced", colors: {} },
        ],
      },
    };

    const registry = new WidgetRegistry();
    const factory = new WidgetFactory();

    // NEW LOGIC: Iterate over config lines and widgets
    for (const [_lineNum, widgets] of Object.entries(config.lines)) {
      for (const widgetConfig of widgets) {
        const widget = factory.createWidget(widgetConfig.id);
        if (widget) {
          applyWidgetConfig(widget, widgetConfig.id, config);
          await registry.register(widget);
        }
      }
    }

    // ASSERT: Only 2 widgets registered (model and cost)
    const allWidgets = registry.getAll();
    expect(allWidgets).to.have.lengthOf(2);
    expect(allWidgets[0].id).to.equal("model");
    expect(allWidgets[1].id).to.equal("cost");
  });

  it("should NOT register widgets that are NOT in config", async () => {
    // Config with only model widget
    const config: LoadedConfig = {
      lines: {
        "0": [{ id: "model", style: "balanced", colors: {} }],
      },
    };

    const registry = new WidgetRegistry();
    const factory = new WidgetFactory();

    // Iterate over config
    for (const [_lineNum, widgets] of Object.entries(config.lines)) {
      for (const widgetConfig of widgets) {
        const widget = factory.createWidget(widgetConfig.id);
        if (widget) {
          applyWidgetConfig(widget, widgetConfig.id, config);
          await registry.register(widget);
        }
      }
    }

    // ASSERT: Only 1 widget registered (model only)
    const allWidgets = registry.getAll();
    expect(allWidgets).to.have.lengthOf(1);
    expect(allWidgets[0].id).to.equal("model");

    // ASSERT: git, context, cost are NOT registered
    const widgetIds = allWidgets.map((w) => w.id);
    expect(widgetIds).to.not.include("git");
    expect(widgetIds).to.not.include("context");
    expect(widgetIds).to.not.include("cost");
  });

  it("should register widgets across multiple lines from config", async () => {
    // Config with widgets on lines 0 and 1
    const config: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "context", style: "balanced", colors: {} },
        ],
        "1": [
          { id: "git", style: "balanced", colors: {} },
          { id: "cost", style: "balanced", colors: {} },
        ],
      },
    };

    const registry = new WidgetRegistry();
    const factory = new WidgetFactory();

    // Iterate over config
    for (const [_lineNum, widgets] of Object.entries(config.lines)) {
      for (const widgetConfig of widgets) {
        const widget = factory.createWidget(widgetConfig.id);
        if (widget) {
          applyWidgetConfig(widget, widgetConfig.id, config);
          await registry.register(widget);
        }
      }
    }

    // ASSERT: 4 widgets registered
    const allWidgets = registry.getAll();
    expect(allWidgets).to.have.lengthOf(4);

    // ASSERT: Correct line assignments
    const modelWidget = allWidgets.find((w) => w.id === "model") as any;
    const contextWidget = allWidgets.find((w) => w.id === "context") as any;
    const gitWidget = allWidgets.find((w) => w.id === "git") as any;
    const costWidget = allWidgets.find((w) => w.id === "cost") as any;

    expect(modelWidget.getLine()).to.equal(0);
    expect(contextWidget.getLine()).to.equal(0);
    expect(gitWidget.getLine()).to.equal(1);
    expect(costWidget.getLine()).to.equal(1);
  });
});
