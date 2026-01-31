/**
 * Unit tests for layout-preview.ts
 * Tests theme rendering and preview generation
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { renderPreviewFromConfig } from "../../../../../src/cli/commands/quick-config/layout-preview.js";
import {
  generateBalancedLayout,
  generateRichLayout,
} from "../../../../../src/config/default-config.js";

describe("layout-preview", () => {
  describe("renderPreviewFromConfig", () => {
    it("should generate different previews for different themes", async () => {
      const config = generateBalancedLayout("balanced", "monokai");

      const monokaiPreview = await renderPreviewFromConfig(config, "balanced", "monokai");
      const nordPreview = await renderPreviewFromConfig(config, "balanced", "nord");

      // Previews should be different (different color codes)
      assert.notStrictEqual(monokaiPreview, nordPreview);
      assert.ok(monokaiPreview.length > 0);
      assert.ok(nordPreview.length > 0);
    });

    it("should generate different previews for monokai and dracula", async () => {
      const config = generateBalancedLayout("balanced", "monokai");

      const monokaiPreview = await renderPreviewFromConfig(config, "balanced", "monokai");
      const draculaPreview = await renderPreviewFromConfig(config, "balanced", "dracula");

      // Should have different color codes
      assert.notStrictEqual(monokaiPreview, draculaPreview);
    });

    it("should generate different previews for nord and rose-pine", async () => {
      const config = generateBalancedLayout("balanced", "monokai");

      const nordPreview = await renderPreviewFromConfig(config, "balanced", "nord");
      const rosePinePreview = await renderPreviewFromConfig(config, "balanced", "rose-pine");

      // Should have different color codes
      assert.notStrictEqual(nordPreview, rosePinePreview);
    });

    it("should contain ANSI color codes in preview", async () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // ANSI escape sequences start with \x1b[
      assert.ok(preview.includes("\x1b["), "Preview should contain ANSI color codes");
    });

    it("should fallback to monokai for invalid theme name", async () => {
      const config = generateBalancedLayout("balanced", "monokai");

      // getThemeByName returns monokai for unknown themes (default fallback)
      const invalidPreview = await renderPreviewFromConfig(
        config,
        "balanced",
        "invalid-theme-name-xyz"
      );
      const monokaiPreview = await renderPreviewFromConfig(config, "balanced", "monokai");

      // Should fall back to monokai (same preview)
      assert.strictEqual(invalidPreview, monokaiPreview);
    });

    it("should render sysmon widget in rich layout preview", async () => {
      const config = generateRichLayout("balanced", "monokai");

      // Rich layout has sysmon on line 3
      assert.ok(config.lines["3"], "Rich layout should have line 3");
      const sysmonWidget = config.lines["3"].find((w: any) => w.id === "sysmon");
      assert.ok(sysmonWidget, "Rich layout should have sysmon widget");

      // Preview should render without errors
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");
      assert.ok(preview.length > 0, "Preview should render");
      // Sysmon shows "CPU XX%" and "RAM" - these are unique to sysmon output
      assert.ok(preview.includes("CPU "), "Preview should contain CPU metrics from sysmon");
      assert.ok(preview.includes("RAM "), "Preview should contain RAM metrics from sysmon");
    });
  });
});
