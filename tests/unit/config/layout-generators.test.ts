/**
 * Tests for layout generator functions
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
} from "../../../src/config/default-config.js";

describe("Layout Generators", () => {
  const defaultStyle = "balanced" as const;
  const defaultTheme = "monokai";

  describe("generateBalancedLayout", () => {
    it("should generate config with 2 lines", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);

      assert.strictEqual(Object.keys(config.lines).length, 2);
      assert.ok(config.lines["0"]);
      assert.ok(config.lines["1"]);
    });

    it("should include model, context, cost, duration, lines on line 0", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      assert.ok(ids.includes("model"));
      assert.ok(ids.includes("context"));
      assert.ok(ids.includes("cost"));
      assert.ok(ids.includes("duration"));
      assert.ok(ids.includes("lines"));
    });

    it("should include git, cache-metrics, config-count, active-tools on line 1", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      const line1 = config.lines["1"];

      const ids = line1.map((w) => w.id);
      assert.ok(ids.includes("git"));
      assert.ok(ids.includes("cache-metrics"));
      assert.ok(ids.includes("config-count"));
      assert.ok(ids.includes("active-tools"));
    });

    it("should have correct version", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.version, "1.0.0");
    });

    it("should have 5 widgets on line 0", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.lines["0"].length, 5);
    });

    it("should have 4 widgets on line 1", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.lines["1"].length, 4);
    });
  });

  describe("generateCompactLayout", () => {
    it("should generate config with 1 line", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);

      assert.strictEqual(Object.keys(config.lines).length, 1);
      assert.ok(config.lines["0"]);
    });

    it("should include model, context, cost, git, duration", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      assert.ok(ids.includes("model"));
      assert.ok(ids.includes("context"));
      assert.ok(ids.includes("cost"));
      assert.ok(ids.includes("git"));
      assert.ok(ids.includes("duration"));
    });

    it("should not include lines widget", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      assert.ok(!ids.includes("lines"));
    });

    it("should not include cache-metrics widget", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      assert.ok(!ids.includes("cache-metrics"));
    });

    it("should not include active-tools widget", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      assert.ok(!ids.includes("active-tools"));
    });

    it("should have correct version", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.version, "1.0.0");
    });

    it("should have 5 widgets on line 0", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.lines["0"].length, 5);
    });
  });

  describe("generateRichLayout", () => {
    it("should generate config with 3 lines", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);

      assert.strictEqual(Object.keys(config.lines).length, 3);
      assert.ok(config.lines["0"]);
      assert.ok(config.lines["1"]);
      assert.ok(config.lines["2"]);
    });

    it("should include model, context, cost, duration on line 0", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      assert.ok(ids.includes("model"));
      assert.ok(ids.includes("context"));
      assert.ok(ids.includes("cost"));
      assert.ok(ids.includes("duration"));
    });

    it("should include git, git-tag, lines, active-tools on line 1", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      const line1 = config.lines["1"];

      const ids = line1.map((w) => w.id);
      assert.ok(ids.includes("git"));
      assert.ok(ids.includes("git-tag"));
      assert.ok(ids.includes("lines"));
      assert.ok(ids.includes("active-tools"));
    });

    it("should include cache-metrics and config-count on line 2", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      const line2 = config.lines["2"];

      const ids = line2.map((w) => w.id);
      assert.ok(ids.includes("cache-metrics"));
      assert.ok(ids.includes("config-count"));
    });

    it("should have correct version", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.version, "1.0.0");
    });

    it("should have 4 widgets on line 0", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.lines["0"].length, 4);
    });

    it("should have 4 widgets on line 1", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.lines["1"].length, 4);
    });

    it("should have 2 widgets on line 2", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);
      assert.strictEqual(config.lines["2"].length, 2);
    });
  });

  describe("Style application", () => {
    it("should apply balanced style to all widgets", () => {
      const config = generateBalancedLayout("balanced", "monokai");

      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.strictEqual(
            widget.style,
            "balanced",
            `Widget ${widget.id} should have balanced style`
          );
        }
      }
    });

    it("should apply playful style to all widgets", () => {
      const config = generateCompactLayout("playful", "monokai");

      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.strictEqual(
            widget.style,
            "playful",
            `Widget ${widget.id} should have playful style`
          );
        }
      }
    });

    it("should apply compact style to all widgets", () => {
      const config = generateRichLayout("compact", "monokai");

      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.strictEqual(
            widget.style,
            "compact",
            `Widget ${widget.id} should have compact style`
          );
        }
      }
    });
  });

  describe("Theme application", () => {
    it("should apply monokai theme colors to all widgets", () => {
      const config = generateBalancedLayout("balanced", "monokai");

      // Check that colors are defined (not empty)
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.ok(widget.colors, `Widget ${widget.id} should have colors defined`);
          assert.ok(
            Object.keys(widget.colors).length > 0,
            `Widget ${widget.id} should have at least one color`
          );
        }
      }
    });

    it("should apply catppuccin-mocha theme colors to all widgets", () => {
      const config = generateCompactLayout("balanced", "catppuccin-mocha");

      // Check that colors are defined (not empty)
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.ok(widget.colors, `Widget ${widget.id} should have colors defined`);
          assert.ok(
            Object.keys(widget.colors).length > 0,
            `Widget ${widget.id} should have at least one color`
          );
        }
      }
    });

    it("should apply nord theme colors to all widgets", () => {
      const config = generateRichLayout("balanced", "nord");

      // Check that colors are defined (not empty)
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.ok(widget.colors, `Widget ${widget.id} should have colors defined`);
          assert.ok(
            Object.keys(widget.colors).length > 0,
            `Widget ${widget.id} should have at least one color`
          );
        }
      }
    });

    it("should use ANSI color codes for all colors", () => {
      const config = generateBalancedLayout("balanced", "monokai");

      // Check that colors start with ANSI escape sequence
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          for (const colorKey in widget.colors) {
            const colorValue = (widget.colors as Record<string, string>)[colorKey];
            assert.ok(
              colorValue.startsWith("\u001b["),
              `Widget ${widget.id} color ${colorKey} should start with ANSI escape sequence`
            );
          }
        }
      }
    });
  });

  describe("Widget color structure", () => {
    it("should have correct color structure for model widget", () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const modelWidget = config.lines["0"].find((w) => w.id === "model");

      assert.ok(modelWidget);
      assert.ok("name" in modelWidget.colors);
      assert.ok("version" in modelWidget.colors);
    });

    it("should have correct color structure for context widget", () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const contextWidget = config.lines["0"].find((w) => w.id === "context");

      assert.ok(contextWidget);
      assert.ok("low" in contextWidget.colors);
      assert.ok("medium" in contextWidget.colors);
      assert.ok("high" in contextWidget.colors);
      assert.ok("bar" in contextWidget.colors);
    });

    it("should have correct color structure for git widget", () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const gitWidget = config.lines["1"].find((w) => w.id === "git");

      assert.ok(gitWidget);
      assert.ok("branch" in gitWidget.colors);
      assert.ok("changes" in gitWidget.colors);
    });

    it("should have correct color structure for cache-metrics widget", () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const cacheWidget = config.lines["1"].find((w) => w.id === "cache-metrics");

      assert.ok(cacheWidget);
      assert.ok("high" in cacheWidget.colors);
      assert.ok("medium" in cacheWidget.colors);
      assert.ok("low" in cacheWidget.colors);
      assert.ok("read" in cacheWidget.colors);
      assert.ok("write" in cacheWidget.colors);
    });

    it("should have correct color structure for active-tools widget", () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const activeToolsWidget = config.lines["1"].find((w) => w.id === "active-tools");

      assert.ok(activeToolsWidget);
      assert.ok("running" in activeToolsWidget.colors);
      assert.ok("completed" in activeToolsWidget.colors);
      assert.ok("error" in activeToolsWidget.colors);
      assert.ok("name" in activeToolsWidget.colors);
      assert.ok("target" in activeToolsWidget.colors);
      assert.ok("count" in activeToolsWidget.colors);
    });

    it("should have correct color structure for git-tag widget", () => {
      const config = generateRichLayout("balanced", "monokai");
      const gitTagWidget = config.lines["1"].find((w) => w.id === "git-tag");

      assert.ok(gitTagWidget);
      assert.ok("base" in gitTagWidget.colors);
    });

    it("should have correct color structure for config-count widget", () => {
      const config = generateRichLayout("balanced", "monokai");
      const configCountWidget = config.lines["2"].find((w) => w.id === "config-count");

      assert.ok(configCountWidget);
      assert.ok("base" in configCountWidget.colors);
    });
  });
});
