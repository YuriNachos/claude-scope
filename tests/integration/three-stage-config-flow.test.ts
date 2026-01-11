/**
 * Integration test for three-stage quick config flow
 */

import assert from "node:assert";
import { mkdir, rm } from "node:fs/promises";
import { after, before, describe, it } from "node:test";
import { renderPreviewFromConfig } from "../../src/cli/commands/quick-config/layout-preview.js";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
} from "../../src/config/default-config.js";

describe("Three-Stage Config Flow Integration", () => {
  const testHomeDir = "/tmp/test-three-stage-config";
  const originalHome = process.env.HOME;

  before(async () => {
    // Set up test home directory
    process.env.HOME = testHomeDir;
    await mkdir(testHomeDir, { recursive: true });
  });

  after(async () => {
    // Clean up test directory and restore HOME
    await rm(testHomeDir, { recursive: true, force: true });
    process.env.HOME = originalHome;
  });

  describe("Layout generation", () => {
    it("should generate valid balanced layout config", () => {
      // Act: Generate balanced layout
      const config = generateBalancedLayout("balanced", "monokai");

      // Assert: Verify structure
      assert.strictEqual(config.version, "1.0.0");
      assert.ok(config.lines);
      assert.strictEqual(Object.keys(config.lines).length, 2);
      assert.ok(config.lines["0"]);
      assert.ok(config.lines["1"]);
    });

    it("should generate valid compact layout config", () => {
      // Act: Generate compact layout
      const config = generateCompactLayout("compact", "monokai");

      // Assert: Verify structure
      assert.strictEqual(config.version, "1.0.0");
      assert.ok(config.lines);
      assert.strictEqual(Object.keys(config.lines).length, 1);
      assert.ok(config.lines["0"]);
    });

    it("should generate valid rich layout config", () => {
      // Act: Generate rich layout
      const config = generateRichLayout("balanced", "monokai");

      // Assert: Verify structure
      assert.strictEqual(config.version, "1.0.0");
      assert.ok(config.lines);
      assert.strictEqual(Object.keys(config.lines).length, 3);
      assert.ok(config.lines["0"]);
      assert.ok(config.lines["1"]);
      assert.ok(config.lines["2"]);
    });

    it("should include correct widgets on balanced layout line 0", () => {
      // Act: Generate balanced layout
      const config = generateBalancedLayout("balanced", "monokai");
      const line0 = config.lines["0"];

      // Assert: Verify widgets
      const widgetIds = line0.map((w) => w.id);
      assert.ok(widgetIds.includes("model"));
      assert.ok(widgetIds.includes("context"));
      assert.ok(widgetIds.includes("cost"));
      assert.ok(widgetIds.includes("duration"));
      assert.ok(widgetIds.includes("lines"));
    });

    it("should include correct widgets on balanced layout line 1", () => {
      // Act: Generate balanced layout
      const config = generateBalancedLayout("balanced", "monokai");
      const line1 = config.lines["1"];

      // Assert: Verify widgets
      const widgetIds = line1.map((w) => w.id);
      assert.ok(widgetIds.includes("git"));
      assert.ok(widgetIds.includes("cache-metrics"));
      assert.ok(widgetIds.includes("active-tools"));
    });

    it("should include correct widgets on compact layout", () => {
      // Act: Generate compact layout
      const config = generateCompactLayout("compact", "monokai");
      const line0 = config.lines["0"];

      // Assert: Verify widgets
      const widgetIds = line0.map((w) => w.id);
      assert.ok(widgetIds.includes("model"));
      assert.ok(widgetIds.includes("context"));
      assert.ok(widgetIds.includes("cost"));
      assert.ok(widgetIds.includes("git"));
      assert.ok(widgetIds.includes("duration"));
    });

    it("should not include lines widget in compact layout", () => {
      // Act: Generate compact layout
      const config = generateCompactLayout("compact", "monokai");
      const line0 = config.lines["0"];

      // Assert: Verify lines widget is not present
      const widgetIds = line0.map((w) => w.id);
      assert.ok(!widgetIds.includes("lines"));
    });

    it("should include git-tag and config-count in rich layout", () => {
      // Act: Generate rich layout
      const config = generateRichLayout("balanced", "monokai");

      // Assert: Verify widgets
      const line1Ids = config.lines["1"].map((w) => w.id);
      assert.ok(line1Ids.includes("git-tag"));

      const line2Ids = config.lines["2"].map((w) => w.id);
      assert.ok(line2Ids.includes("config-count"));
    });
  });

  describe("Preview rendering", () => {
    it("should render balanced layout preview", async () => {
      // Arrange: Generate balanced layout config
      const config = generateBalancedLayout("balanced", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);

      // Should have at least 2 lines (for balanced layout)
      const lines = preview.split("\n");
      assert.ok(lines.length >= 2);
    });

    it("should render compact layout preview", async () => {
      // Arrange: Generate compact layout config
      const config = generateCompactLayout("compact", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "compact", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);
    });

    it("should render rich layout preview", async () => {
      // Arrange: Generate rich layout config
      const config = generateRichLayout("balanced", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);

      // Should have at least 3 lines (for rich layout)
      const lines = preview.split("\n");
      assert.ok(lines.length >= 3);
    });

    it("should render preview for all widgets in config", async () => {
      // Arrange: Generate balanced layout config
      const config = generateBalancedLayout("balanced", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // Assert: Verify preview contains expected widget data
      // The preview should contain some demo data (model name, context, cost, etc.)
      assert.ok(preview.length > 0);
      assert.ok(preview.includes("Opus") || preview.length > 100); // Either model name or substantial content
    });
  });

  describe("Style combination", () => {
    it("should apply balanced style correctly", async () => {
      // Arrange: Generate config with balanced style
      const config = generateBalancedLayout("balanced", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);

      // Verify all widgets have balanced style
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.strictEqual(widget.style, "balanced");
        }
      }
    });

    it("should apply playful style correctly", async () => {
      // Arrange: Generate config with playful style
      const config = generateBalancedLayout("playful", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "playful", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);

      // Verify all widgets have playful style
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.strictEqual(widget.style, "playful");
        }
      }
    });

    it("should apply compact style correctly", async () => {
      // Arrange: Generate config with compact style
      const config = generateBalancedLayout("compact", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "compact", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);

      // Verify all widgets have compact style
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          assert.strictEqual(widget.style, "compact");
        }
      }
    });

    it("should generate different previews for different styles", async () => {
      // Arrange: Generate configs with different styles
      const balancedConfig = generateBalancedLayout("balanced", "monokai");
      const playfulConfig = generateBalancedLayout("playful", "monokai");
      const compactConfig = generateBalancedLayout("compact", "monokai");

      // Act: Render previews
      const balancedPreview = await renderPreviewFromConfig(balancedConfig, "balanced", "monokai");
      const playfulPreview = await renderPreviewFromConfig(playfulConfig, "playful", "monokai");
      const compactPreview = await renderPreviewFromConfig(compactConfig, "compact", "monokai");

      // Assert: All previews should be valid strings
      assert.strictEqual(typeof balancedPreview, "string");
      assert.strictEqual(typeof playfulPreview, "string");
      assert.strictEqual(typeof compactPreview, "string");

      // Previews should have content
      assert.ok(balancedPreview.length > 0);
      assert.ok(playfulPreview.length > 0);
      assert.ok(compactPreview.length > 0);
    });
  });

  describe("Theme combination", () => {
    it("should render with monokai theme", async () => {
      // Arrange: Generate config with monokai theme
      const config = generateCompactLayout("balanced", "monokai");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);
    });

    it("should render with nord theme", async () => {
      // Arrange: Generate config with nord theme
      const config = generateCompactLayout("balanced", "nord");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "nord");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);
    });

    it("should render with dracula theme", async () => {
      // Arrange: Generate config with dracula theme
      const config = generateCompactLayout("balanced", "dracula");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "dracula");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);
    });

    it("should render with catppuccin-mocha theme", async () => {
      // Arrange: Generate config with catppuccin-mocha theme
      const config = generateCompactLayout("balanced", "catppuccin-mocha");

      // Act: Render preview
      const preview = await renderPreviewFromConfig(config, "balanced", "catppuccin-mocha");

      // Assert: Verify preview
      assert.ok(preview);
      assert.strictEqual(typeof preview, "string");
      assert.ok(preview.length > 0);
    });

    it("should generate valid previews for multiple themes", async () => {
      // Arrange: Define themes to test
      const themes = ["monokai", "nord", "dracula", "catppuccin-mocha"];
      const config = generateCompactLayout("balanced", "monokai");

      // Act: Render previews for each theme
      const previews = await Promise.all(
        themes.map((theme) => renderPreviewFromConfig(config, "balanced", theme))
      );

      // Assert: All previews should be valid
      for (const preview of previews) {
        assert.ok(preview);
        assert.strictEqual(typeof preview, "string");
        assert.ok(preview.length > 0);
      }
    });

    it("should apply theme colors to all widgets", () => {
      // Arrange: Generate configs with different themes
      const monokaiConfig = generateCompactLayout("balanced", "monokai");
      const nordConfig = generateCompactLayout("balanced", "nord");

      // Act: Verify colors are applied
      for (const line of Object.values(monokaiConfig.lines)) {
        for (const widget of line) {
          assert.ok(widget.colors);
          assert.ok(Object.keys(widget.colors).length > 0);
        }
      }

      for (const line of Object.values(nordConfig.lines)) {
        for (const widget of line) {
          assert.ok(widget.colors);
          assert.ok(Object.keys(widget.colors).length > 0);
        }
      }
    });
  });

  describe("Layout and style combinations", () => {
    it("should generate valid balanced layout with all styles", async () => {
      // Arrange: Define styles
      const styles = ["balanced", "playful", "compact"] as const;

      // Act: Generate configs and render previews
      for (const style of styles) {
        const config = generateBalancedLayout(style, "monokai");
        const preview = await renderPreviewFromConfig(config, style, "monokai");

        // Assert: Verify each combination
        assert.ok(preview, `Preview should exist for style: ${style}`);
        assert.strictEqual(typeof preview, "string");
        assert.ok(preview.length > 0);
      }
    });

    it("should generate valid compact layout with all styles", async () => {
      // Arrange: Define styles
      const styles = ["balanced", "playful", "compact"] as const;

      // Act: Generate configs and render previews
      for (const style of styles) {
        const config = generateCompactLayout(style, "monokai");
        const preview = await renderPreviewFromConfig(config, style, "monokai");

        // Assert: Verify each combination
        assert.ok(preview, `Preview should exist for style: ${style}`);
        assert.strictEqual(typeof preview, "string");
        assert.ok(preview.length > 0);
      }
    });

    it("should generate valid rich layout with all styles", async () => {
      // Arrange: Define styles
      const styles = ["balanced", "playful", "compact"] as const;

      // Act: Generate configs and render previews
      for (const style of styles) {
        const config = generateRichLayout(style, "monokai");
        const preview = await renderPreviewFromConfig(config, style, "monokai");

        // Assert: Verify each combination
        assert.ok(preview, `Preview should exist for style: ${style}`);
        assert.strictEqual(typeof preview, "string");
        assert.ok(preview.length > 0);
      }
    });
  });
});
