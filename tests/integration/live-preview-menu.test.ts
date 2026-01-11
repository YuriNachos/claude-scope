/**
 * Integration tests for live preview menu
 * Tests layout generator functions across all combinations
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import type { QuickConfigStyle } from "../../src/cli/commands/quick-config/config-schema.js";
import type { PreviewChoice } from "../../src/cli/commands/quick-config/select-with-preview.js";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
} from "../../src/config/default-config.js";

describe("Live Preview Menu Integration", () => {
  it("should generate correct config for all layout choices", () => {
    const layoutChoices: PreviewChoice<string>[] = [
      {
        name: "Balanced",
        value: "balanced",
        getConfig: (s: QuickConfigStyle, t: string) => generateBalancedLayout(s, t),
      },
      {
        name: "Compact",
        value: "compact",
        getConfig: (s: QuickConfigStyle, t: string) => generateCompactLayout(s, t),
      },
      {
        name: "Rich",
        value: "rich",
        getConfig: (s: QuickConfigStyle, t: string) => generateRichLayout(s, t),
      },
    ];

    // Test all choices generate valid configs
    layoutChoices.forEach((choice) => {
      const config = choice.getConfig("balanced", "monokai");
      assert.strictEqual(config.version, "1.0.0");
      assert.ok(Object.keys(config.lines).length > 0, `${choice.name} should have lines`);
    });
  });

  it("should generate configs for all style combinations", () => {
    const styles: QuickConfigStyle[] = ["balanced", "playful", "compact"];

    styles.forEach((style) => {
      const config = generateBalancedLayout(style, "monokai");
      assert.strictEqual(config.version, "1.0.0");

      // Verify style is applied to all widgets
      Object.values(config.lines)
        .flat()
        .forEach((widget) => {
          assert.strictEqual(widget.style, style, `Widget style should be ${style}`);
        });
    });
  });

  it("should generate configs for all theme choices", () => {
    const themes = [
      "monokai",
      "nord",
      "dracula",
      "catppuccin-mocha",
      "tokyo-night",
      "vscode-dark-plus",
      "github-dark-dimmed",
      "dusty-sage",
      "gray",
      "muted-gray",
      "slate-blue",
      "professional-blue",
      "rose-pine",
      "semantic-classic",
      "solarized-dark",
      "one-dark-pro",
      "cyberpunk-neon",
    ];

    themes.forEach((theme) => {
      const config = generateBalancedLayout("balanced", theme);
      assert.strictEqual(config.version, "1.0.0");
      assert.ok(config.lines["0"], "Should have line 0");
      assert.ok(config.lines["1"], "Should have line 1");
    });
  });

  it("should handle layout × style × theme combinations", () => {
    const layouts = ["balanced", "compact", "rich"] as const;
    const styles: QuickConfigStyle[] = ["balanced", "playful"];
    const themes = ["monokai", "nord"];

    let count = 0;
    layouts.forEach((layout) => {
      styles.forEach((style) => {
        themes.forEach((theme) => {
          const generator =
            layout === "balanced"
              ? generateBalancedLayout
              : layout === "compact"
                ? generateCompactLayout
                : generateRichLayout;

          const config = generator(style, theme);
          assert.strictEqual(config.version, "1.0.0");
          count++;
        });
      });
    });

    assert.strictEqual(count, 12, "Should test all combinations");
  });

  it("should verify Balanced layout structure", () => {
    const config = generateBalancedLayout("balanced", "monokai");

    // Balanced has 2 lines
    assert.strictEqual(Object.keys(config.lines).length, 2);
    assert.ok(config.lines["0"], "Should have line 0");
    assert.ok(config.lines["1"], "Should have line 1");

    // Line 0: model, context, cost, duration, lines (5 widgets)
    assert.strictEqual(config.lines["0"].length, 5);
    const line0Ids = config.lines["0"].map((w) => w.id);
    assert.ok(line0Ids.includes("model"));
    assert.ok(line0Ids.includes("context"));
    assert.ok(line0Ids.includes("cost"));
    assert.ok(line0Ids.includes("duration"));
    assert.ok(line0Ids.includes("lines"));

    // Line 1: git, cache-metrics, config-count, active-tools (4 widgets)
    assert.strictEqual(config.lines["1"].length, 4);
    const line1Ids = config.lines["1"].map((w) => w.id);
    assert.ok(line1Ids.includes("git"));
    assert.ok(line1Ids.includes("cache-metrics"));
    assert.ok(line1Ids.includes("config-count"));
    assert.ok(line1Ids.includes("active-tools"));
  });

  it("should verify Compact layout structure", () => {
    const config = generateCompactLayout("balanced", "monokai");

    // Compact has 1 line
    assert.strictEqual(Object.keys(config.lines).length, 1);
    assert.ok(config.lines["0"], "Should have line 0");

    // Line 0: model, context, cost, git, duration (5 widgets)
    assert.strictEqual(config.lines["0"].length, 5);
    const line0Ids = config.lines["0"].map((w) => w.id);
    assert.ok(line0Ids.includes("model"));
    assert.ok(line0Ids.includes("context"));
    assert.ok(line0Ids.includes("cost"));
    assert.ok(line0Ids.includes("git"));
    assert.ok(line0Ids.includes("duration"));
  });

  it("should verify Rich layout structure", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Rich has 3 lines
    assert.strictEqual(Object.keys(config.lines).length, 3);
    assert.ok(config.lines["0"], "Should have line 0");
    assert.ok(config.lines["1"], "Should have line 1");
    assert.ok(config.lines["2"], "Should have line 2");

    // Line 0: model, context, cost, lines, duration (5 widgets)
    assert.strictEqual(config.lines["0"].length, 5);
    const line0Ids = config.lines["0"].map((w) => w.id);
    assert.ok(line0Ids.includes("model"));
    assert.ok(line0Ids.includes("context"));
    assert.ok(line0Ids.includes("cost"));
    assert.ok(line0Ids.includes("lines"));
    assert.ok(line0Ids.includes("duration"));

    // Line 1: git, git-tag, active-tools (3 widgets)
    assert.strictEqual(config.lines["1"].length, 3);
    const line1Ids = config.lines["1"].map((w) => w.id);
    assert.ok(line1Ids.includes("git"));
    assert.ok(line1Ids.includes("git-tag"));
    assert.ok(line1Ids.includes("active-tools"));

    // Line 2: cache-metrics, config-count (2 widgets)
    assert.strictEqual(config.lines["2"].length, 2);
    const line2Ids = config.lines["2"].map((w) => w.id);
    assert.ok(line2Ids.includes("cache-metrics"));
    assert.ok(line2Ids.includes("config-count"));
  });

  it("should apply theme colors to all widgets", () => {
    const config = generateBalancedLayout("balanced", "nord");

    // Verify all widgets have colors
    Object.values(config.lines)
      .flat()
      .forEach((widget) => {
        assert.ok(widget.colors, `Widget ${widget.id} should have colors`);
        assert.ok(typeof widget.colors === "object", `Widget ${widget.id} colors should be object`);
      });
  });
});
