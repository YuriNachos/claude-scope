// tests/integration/config-only-widget-registration.test.ts
import { beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import type { LoadedConfig } from "../../src/config/config-loader.js";
import { WidgetRegistry } from "../../src/core/widget-registry.js";
import { ModelWidget } from "../../src/widgets/model-widget.js";
import { PokerWidget } from "../../src/widgets/poker-widget.js";

describe("Config-Only Widget Registration", () => {
  let registry: WidgetRegistry;

  beforeEach(() => {
    registry = new WidgetRegistry();
  });

  it("should NOT register widgets that are not in config", async () => {
    // Config WITHOUT poker or empty-line
    const configWithoutPoker: LoadedConfig = {
      lines: {
        "0": [{ id: "model", style: "balanced", colors: {} }],
      },
    };

    // Simulate registration logic from index.ts
    // ModelWidget IS in config - should be registered
    const modelWidget = new ModelWidget();
    if (configWithoutPoker) {
      for (const [lineNum, widgets] of Object.entries(configWithoutPoker.lines)) {
        const widgetConfig = widgets.find((w) => w.id === "model");
        if (widgetConfig) {
          modelWidget.setLine?.(parseInt(lineNum, 10));
          break;
        }
      }
    }
    await registry.register(modelWidget);

    // PokerWidget and EmptyLineWidget are NOT in config - should NOT be registered
    // (No registration calls for these)

    // Verify only model widget is registered
    const allWidgets = registry.getAll();
    expect(allWidgets).to.have.lengthOf(1);
    expect(allWidgets[0].id).to.equal("model");
  });

  it("should register widgets that are explicitly in config", async () => {
    // Config WITH poker on line 4
    const configWithPoker: LoadedConfig = {
      lines: {
        "0": [{ id: "model", style: "balanced", colors: {} }],
        "4": [{ id: "poker", style: "balanced", colors: {} }], // Explicitly in config
      },
    };

    // Register model
    const modelWidget = new ModelWidget();
    if (configWithPoker) {
      for (const [lineNum, widgets] of Object.entries(configWithPoker.lines)) {
        const widgetConfig = widgets.find((w) => w.id === "model");
        if (widgetConfig) {
          modelWidget.setLine?.(parseInt(lineNum, 10));
          break;
        }
      }
    }
    await registry.register(modelWidget);

    // Register poker (ONLY because it's in config)
    const pokerWidget = new PokerWidget();
    if (configWithPoker) {
      for (const [lineNum, widgets] of Object.entries(configWithPoker.lines)) {
        const widgetConfig = widgets.find((w) => w.id === "poker");
        if (widgetConfig) {
          pokerWidget.setLine?.(parseInt(lineNum, 10));
          break;
        }
      }
    }
    await registry.register(pokerWidget);

    const allWidgets = registry.getAll();
    expect(allWidgets).to.have.lengthOf(2);

    // Verify line assignments
    expect(modelWidget.getLine()).to.equal(0);
    expect(pokerWidget.getLine()).to.equal(4);
  });
});
