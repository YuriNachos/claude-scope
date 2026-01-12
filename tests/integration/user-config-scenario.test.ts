/**
 * Integration test for user's actual config scenario
 * Verifies that user's real config structure works with new config-driven logic
 */

import { afterEach, beforeEach, describe, it } from "node:test";
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

describe("User Config Scenario", () => {
  it("should register only widgets in user config (no git-tag)", async () => {
    // User's actual config structure (git-tag is NOT in config)
    const userConfig: LoadedConfig = {
      lines: {
        "0": [
          { id: "model", style: "balanced", colors: {} },
          { id: "context", style: "balanced", colors: {} },
          { id: "cost", style: "balanced", colors: {} },
          { id: "duration", style: "balanced", colors: {} },
          { id: "lines", style: "balanced", colors: {} },
        ],
        "1": [
          { id: "git", style: "balanced", colors: {} },
          { id: "cache-metrics", style: "balanced", colors: {} },
          { id: "config-count", style: "balanced", colors: {} },
          { id: "active-tools", style: "balanced", colors: {} },
        ],
      },
    };

    const registry = new WidgetRegistry();
    const factory = new WidgetFactory();

    // Config-driven registration
    for (const [lineNum, widgets] of Object.entries(userConfig.lines)) {
      for (const widgetConfig of widgets) {
        const widget = factory.createWidget(widgetConfig.id);
        if (widget) {
          applyWidgetConfig(widget, widgetConfig.id, userConfig);
          await registry.register(widget);
        }
      }
    }

    // ASSERT: Exactly 9 widgets registered
    const allWidgets = registry.getAll();
    expect(allWidgets).to.have.lengthOf(9);

    // ASSERT: All expected widgets present
    const widgetIds = allWidgets.map((w) => w.id);
    expect(widgetIds).to.include.members([
      "model",
      "context",
      "cost",
      "duration",
      "lines",
      "git",
      "cache-metrics",
      "config-count",
      "active-tools",
    ]);

    // ASSERT: git-tag is NOT registered (not in config!)
    expect(widgetIds).to.not.include("git-tag");

    // ASSERT: Correct line assignments
    const modelWidget = allWidgets.find((w) => w.id === "model") as any;
    const gitWidget = allWidgets.find((w) => w.id === "git") as any;

    expect(modelWidget.getLine()).to.equal(0);
    expect(gitWidget.getLine()).to.equal(1);
  });
});
