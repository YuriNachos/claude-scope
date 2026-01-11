/**
 * Integration tests for quick-config system
 * Tests end-to-end config save/load functionality
 */

import assert from "node:assert";
import { mkdir, rm } from "node:fs/promises";
import { after, before, describe, it } from "node:test";
import { loadConfig, saveConfig } from "../../src/cli/commands/quick-config/index.js";
import { generateDefaultConfig } from "../../src/config/default-config.js";

describe("Quick Config Integration", () => {
  const testHomeDir = "/tmp/test-quick-config-integration";
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

  describe("save and load config", () => {
    it("should return null for missing config", async () => {
      // Act: Try to load config when none exists
      // Note: Config file doesn't exist yet in fresh test directory
      const loaded = await loadConfig();

      // Assert: Should return null
      assert.strictEqual(loaded, null, "Should return null for missing config");
    });

    it("should save and load config successfully", async () => {
      // Arrange: Generate default config
      const config = generateDefaultConfig();

      // Act: Save config
      await saveConfig(config);

      // Assert: Load config and verify
      const loaded = await loadConfig();
      assert.ok(loaded, "Config should be loaded");
      assert.strictEqual(loaded.version, config.version, "Version should match");
      assert.ok(loaded.lines, "Lines config should exist");
      assert.ok(loaded.lines["0"], "Line 0 should exist");
      assert.ok(loaded.lines["1"], "Line 1 should exist");
      assert.ok(loaded.lines["2"], "Line 2 should exist");
    });

    it("should overwrite existing config", async () => {
      // Arrange: Save initial config
      const config1 = generateDefaultConfig();
      await saveConfig(config1);

      // Act: Save new config with different version
      const config2 = { ...generateDefaultConfig(), version: "1.0.1" };
      await saveConfig(config2);

      // Assert: Load should return new config
      const loaded = await loadConfig();
      assert.ok(loaded, "Config should be loaded");
      assert.strictEqual(loaded.version, "1.0.1", "Version should be updated");
      assert.notStrictEqual(loaded.version, config1.version, "Should not be old version");
    });
  });

  describe("config structure validation", () => {
    it("should preserve widget configuration", async () => {
      // Arrange: Generate config with specific structure
      const config = generateDefaultConfig();

      // Act: Save and load
      await saveConfig(config);
      const loaded = await loadConfig();

      // Assert: Verify widget structure is preserved
      assert.ok(loaded, "Config should be loaded");

      // Check line 0 widgets (model, context, cost, lines, duration, git)
      const line0Widgets = loaded.lines["0"];
      assert.ok(Array.isArray(line0Widgets), "Line 0 should be an array");
      assert.strictEqual(line0Widgets.length, 6, "Line 0 should have 6 widgets");

      // Verify widget structure
      const modelWidget = line0Widgets.find((w) => w.id === "model");
      assert.ok(modelWidget, "Model widget should exist");
      assert.strictEqual(modelWidget.id, "model");
      assert.strictEqual(typeof modelWidget.style, "string");
      assert.ok(modelWidget.colors, "Widget should have colors");
    });

    it("should preserve style and theme settings", async () => {
      // Arrange: Generate default config (uses balanced style and dusty-sage theme)
      const config = generateDefaultConfig();

      // Act: Save and load
      await saveConfig(config);
      const loaded = await loadConfig();

      // Assert: Verify all widgets have balanced style
      assert.ok(loaded, "Config should be loaded");

      for (const lineKey of Object.keys(loaded.lines)) {
        const widgets = loaded.lines[lineKey];
        for (const widget of widgets) {
          assert.strictEqual(
            widget.style,
            "balanced",
            `Widget ${widget.id} should have balanced style`
          );
        }
      }
    });
  });

  describe("config persistence", () => {
    it("should handle multiple save/load cycles", async () => {
      // Arrange: Generate config
      const config1 = generateDefaultConfig();

      // Act: Save and load multiple times
      await saveConfig(config1);
      let loaded = await loadConfig();
      assert.strictEqual(loaded.version, config1.version);

      const config2 = { ...generateDefaultConfig(), version: "1.0.2" };
      await saveConfig(config2);
      loaded = await loadConfig();
      assert.strictEqual(loaded.version, "1.0.2");

      const config3 = { ...generateDefaultConfig(), version: "1.0.3" };
      await saveConfig(config3);
      loaded = await loadConfig();
      assert.strictEqual(loaded.version, "1.0.3");

      // Assert: Final state should be last saved version
      assert.strictEqual(loaded.version, "1.0.3");
    });
  });
});
