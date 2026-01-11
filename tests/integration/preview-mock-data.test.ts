/**
 * Integration test for preview with mock data
 * Verifies that preview renders with demo data from mock providers
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { renderPreviewFromConfig } from "../../src/cli/commands/quick-config/layout-preview.js";
import { generateBalancedLayout, generateRichLayout } from "../../src/config/default-config.js";

describe("Preview with Mock Data", () => {
  it("should show git branch in preview", async () => {
    const config = generateBalancedLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should show "main" branch somewhere in preview
    assert.ok(preview.includes("main"), "Preview should show demo branch 'main'");
  });

  it("should show git changes in preview", async () => {
    const config = generateBalancedLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should show insertions (+142 or +15)
    assert.ok(
      preview.includes("+142") || preview.includes("+15") || preview.includes("+"),
      "Preview should show demo insertions"
    );
  });

  it("should show git tag in Rich layout", async () => {
    const config = generateRichLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should show version tag "0.8.3" or "v0.8.3"
    assert.ok(preview.includes("0.8.3"), "Preview should show demo tag '0.8.3'");
  });

  it("should NOT show dash for git-tag", async () => {
    const config = generateRichLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should not have orphaned dash (which indicates missing tag)
    // Check that we don't have " │ — " pattern (separator + dash + separator)
    assert.ok(!preview.includes(" │ — "), "Preview should not show dash for missing tag");
  });

  it("should show active tools in preview", async () => {
    const config = generateBalancedLayout("balanced", "monokai");
    const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

    // Should show tool names (Read, Edit, Bash)
    const hasRead = preview.includes("Read") || preview.includes("Edits:");
    const hasEdit = preview.includes("Edit");
    const hasBash = preview.includes("Bash");

    assert.ok(hasRead || hasEdit || hasBash, "Preview should show demo tools");
  });
});
