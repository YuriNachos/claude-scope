import assert from "node:assert";
import { describe, it } from "node:test";
import {
  type BaseColors,
  type CacheColors,
  CONFIG_VERSION,
  type ColorCode,
  type ContextColors,
  type CostColors,
  type DurationColors,
  type GitColors,
  type LinesColors,
  type LinesConfig,
  type ModelColors,
  type PokerColors,
  QUICK_CONFIG_STYLES,
  type QuickConfigStyle,
  type ScopeConfig,
  type SemanticColors,
  type ToolsColors,
  type WidgetConfig,
} from "../../../../../src/cli/commands/quick-config/config-schema.js";

describe("ConfigSchema", () => {
  it("should define config version constant", () => {
    assert.strictEqual(CONFIG_VERSION, "1.0.0");
  });

  it("should define quick config styles", () => {
    assert.deepStrictEqual(QUICK_CONFIG_STYLES, ["balanced", "playful", "compact"]);
  });

  it("should accept valid ScopeConfig structure", () => {
    const config: ScopeConfig = {
      version: "1.0.0",
      lines: {
        "0": [
          {
            id: "model",
            style: "balanced",
            colors: {
              name: "\u001b[38;2;148;163;184m",
              version: "\u001b[38;2;120;130;140m",
            },
          },
        ],
      },
    };

    assert.strictEqual(config.version, "1.0.0");
    assert.strictEqual(config.lines["0"][0].id, "model");
  });

  it("should support all widget color types", () => {
    const modelColors: ModelColors = {
      name: "\u001b[38;2;148;163;184m",
      version: "\u001b[38;2;120;130;140m",
    };

    const contextColors: ContextColors = {
      low: "\u001b[38;2;74;222;128m",
      medium: "\u001b[38;2;250;204;21m",
      high: "\u001b[38;2;248;113;113m",
      bar: "\u001b[38;2;100;100;100m",
    };

    const costColors: CostColors = {
      amount: "\u001b[38;2;148;163;184m",
      currency: "\u001b[38;2;120;130;140m",
    };

    const linesColors: LinesColors = {
      added: "\u001b[38;2;74;222;128m",
      removed: "\u001b[38;2;248;113;113m",
    };

    const durationColors: DurationColors = {
      value: "\u001b[38;2;148;163;184m",
      unit: "\u001b[38;2;120;130;140m",
    };

    const gitColors: GitColors = {
      branch: "\u001b[38;2;148;163;184m",
      changes: "\u001b[38;2;120;130;140m",
    };

    const cacheColors: CacheColors = {
      high: "\u001b[38;2;74;222;128m",
      medium: "\u001b[38;2;250;204;21m",
      low: "\u001b[38;2;248;113;113m",
      read: "\u001b[38;2;148;163;184m",
      write: "\u001b[38;2;120;130;140m",
    };

    const toolsColors: ToolsColors = {
      running: "\u001b[38;2;250;204;21m",
      completed: "\u001b[38;2;74;222;128m",
      error: "\u001b[38;2;248;113;113m",
      name: "\u001b[38;2;148;163;184m",
      target: "\u001b[38;2;120;130;140m",
      count: "\u001b[38;2;100;100;100m",
    };

    const pokerColors: PokerColors = {
      participating: "\u001b[38;2;148;163;184m",
      nonParticipating: "\u001b[38;2;100;116;139m",
      result: "\u001b[38;2;250;204;21m",
    };

    const baseColors: BaseColors = {
      text: "\u001b[38;2;148;163;184m",
      muted: "\u001b[38;2;120;130;140m",
      accent: "\u001b[38;2;100;100;100m",
      border: "\u001b[38;2;80;80;80m",
    };

    const semanticColors: SemanticColors = {
      success: "\u001b[38;2;74;222;128m",
      warning: "\u001b[38;2;250;204;21m",
      error: "\u001b[38;2;248;113;113m",
      info: "\u001b[38;2;96;165;250m",
    };

    assert.ok(modelColors.name);
    assert.ok(contextColors.bar);
    assert.ok(costColors.currency);
    assert.ok(linesColors.added);
    assert.ok(durationColors.unit);
    assert.ok(gitColors.branch);
    assert.ok(cacheColors.read);
    assert.ok(toolsColors.count);
    assert.ok(pokerColors.participating);
    assert.ok(baseColors.text);
    assert.ok(semanticColors.info);
  });

  it("should accept ColorCode type", () => {
    const color: ColorCode = "\u001b[38;2;148;163;184m";
    assert.strictEqual(color, "\u001b[38;2;148;163;184m");
  });

  it("should accept QuickConfigStyle type", () => {
    const style1: QuickConfigStyle = "balanced";
    const style2: QuickConfigStyle = "playful";
    const style3: QuickConfigStyle = "compact";

    assert.strictEqual(style1, "balanced");
    assert.strictEqual(style2, "playful");
    assert.strictEqual(style3, "compact");
  });

  it("should support complex multi-line config", () => {
    const config: ScopeConfig = {
      version: "1.0.0",
      lines: {
        "0": [
          {
            id: "model",
            style: "balanced",
            colors: {
              name: "\u001b[38;2;148;163;184m",
              version: "\u001b[38;2;120;130;140m",
            },
          },
          {
            id: "context",
            style: "playful",
            colors: {
              low: "\u001b[38;2;74;222;128m",
              medium: "\u001b[38;2;250;204;21m",
              high: "\u001b[38;2;248;113;113m",
              bar: "\u001b[38;2;100;100;100m",
            },
          },
        ],
        "1": [
          {
            id: "git",
            style: "compact",
            colors: {
              branch: "\u001b[38;2;148;163;184m",
              changes: "\u001b[38;2;120;130;140m",
            },
          },
        ],
      },
    };

    assert.strictEqual(config.lines["0"]?.length, 2);
    assert.strictEqual(config.lines["1"]?.[0].id, "git");
  });

  it("should support minimal color config", () => {
    const widgetConfig: WidgetConfig = {
      id: "simple-widget",
      style: "balanced",
      colors: {
        base: "\u001b[38;2;148;163;184m",
      },
    };

    assert.strictEqual(widgetConfig.id, "simple-widget");
    assert.strictEqual((widgetConfig.colors as { base: string }).base, "\u001b[38;2;148;163;184m");
  });

  it("should support LinesConfig with string keys", () => {
    const linesConfig: LinesConfig = {
      "0": [
        {
          id: "widget1",
          style: "balanced",
          colors: {
            base: "\u001b[38;2;148;163;184m",
          },
        },
      ],
      "1": [],
      "2": [
        {
          id: "widget2",
          style: "playful",
          colors: {
            base: "\u001b[38;2;120;130;140m",
          },
        },
      ],
    };

    assert.strictEqual(Object.keys(linesConfig).length, 3);
    assert.ok(linesConfig["0"]);
    assert.ok(linesConfig["1"]);
    assert.ok(linesConfig["2"]);
  });
});
