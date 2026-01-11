/**
 * Unit tests for layout-preview.ts
 * Tests theme rendering and preview generation
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { renderPreviewFromConfig } from "../../../../../src/cli/commands/quick-config/layout-preview.js";
import { generateBalancedLayout } from "../../../../../src/config/default-config.js";

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
  });
});
