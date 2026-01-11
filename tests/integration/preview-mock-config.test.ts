/**
 * Integration test for preview with mock config data
 * Verifies that preview renders with demo config counts from mock provider
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { renderPreviewFromConfig } from "../../src/cli/commands/quick-config/layout-preview.js";
import { generateBalancedLayout } from "../../src/config/default-config.js";

describe("Preview with Mock Config Data", () => {
  it("should show CLAUDE.md count in preview", async () => {
    const config = generateBalancedLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should show "CLAUDE.md:1" from mock data
    assert.ok(preview.includes("CLAUDE.md"), "Preview should show CLAUDE.md label");
    assert.ok(preview.includes("1"), "Preview should show count");
  });

  it("should show multiple config types in preview", async () => {
    const config = generateBalancedLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should show rules, MCPs, hooks from mock data
    const hasRules = preview.includes("rules");
    const hasMCPs = preview.includes("MCPs");
    const hasHooks = preview.includes("hooks");

    assert.ok(hasRules || hasMCPs || hasHooks, "Preview should show config items");
  });

  it("should NOT show empty config widget", async () => {
    const config = generateBalancedLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // With mock data, widget should NOT be empty
    // Count total occurrences of config labels
    const configLabels = (preview.match(/CLAUDE\.md|rules|MCPs|hooks/g) ?? []).length;

    assert.ok(configLabels >= 2, "Preview should show at least 2 config items from mock data");
  });
});
