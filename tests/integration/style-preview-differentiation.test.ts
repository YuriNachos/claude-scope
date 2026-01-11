/**
 * Integration test for style preview differentiation
 * Verifies that different styles produce different preview outputs
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { renderPreviewFromConfig } from "../../src/cli/commands/quick-config/layout-preview.js";
import { generateBalancedLayout } from "../../src/config/default-config.js";

describe("Style Preview Differentiation", () => {
  it("should generate different previews for balanced vs playful style", async () => {
    const config = generateBalancedLayout("balanced", "monokai");

    const balancedPreview = await renderPreviewFromConfig(config, "balanced", "monokai");
    const playfulPreview = await renderPreviewFromConfig(config, "playful", "monokai");

    // Playful should have emojis, balanced should not (or different formatting)
    assert.notStrictEqual(balancedPreview, playfulPreview);
  });

  it("should generate different previews for balanced vs compact style", async () => {
    const config = generateBalancedLayout("balanced", "monokai");

    const balancedPreview = await renderPreviewFromConfig(config, "balanced", "monokai");
    const compactPreview = await renderPreviewFromConfig(config, "compact", "monokai");

    // Compact should have condensed formatting
    assert.notStrictEqual(balancedPreview, compactPreview);
  });

  it("should generate different previews for playful vs compact style", async () => {
    const config = generateBalancedLayout("balanced", "monokai");

    const playfulPreview = await renderPreviewFromConfig(config, "playful", "monokai");
    const compactPreview = await renderPreviewFromConfig(config, "compact", "monokai");

    assert.notStrictEqual(playfulPreview, compactPreview);
  });
});
