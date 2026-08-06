import assert from "node:assert";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { renderPreview } from "../../../../../src/cli/commands/quick-config/preview.js";

describe("PreviewRenderer", () => {
  // renderPreview() updates a real ContextWidget/CacheMetricsWidget with demo
  // data, and those go through CacheManager, which defaults to the real
  // ~/.config/claude-scope/cache.json (src/config/paths.ts getCachePath).
  // Point it at a temp dir for the lifetime of this file.
  const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
  let cacheHomeDir: string;

  before(async () => {
    cacheHomeDir = await mkdtemp(join(tmpdir(), "claude-scope-preview-"));
    process.env.CLAUDE_SCOPE_HOME = cacheHomeDir;
  });

  after(async () => {
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
    await rm(cacheHomeDir, { recursive: true, force: true });
  });

  it("should render preview with balanced style and dusty-sage theme", async () => {
    const output = await renderPreview("balanced", "dusty-sage");

    assert.ok(typeof output === "string");
    assert.ok(output.length > 0);
  });

  it("should render different styles", async () => {
    const balanced = await renderPreview("balanced", "dusty-sage");
    const playful = await renderPreview("playful", "dusty-sage");
    const compact = await renderPreview("compact", "dusty-sage");

    assert.ok(balanced !== playful);
    assert.ok(playful !== compact);
  });

  it("should render different themes", async () => {
    const dustySage = await renderPreview("balanced", "dusty-sage");
    const monokai = await renderPreview("balanced", "monokai");

    assert.ok(typeof dustySage === "string");
    assert.ok(typeof monokai === "string");
  });

  it("should not include poker widget", async () => {
    const output = await renderPreview("balanced", "dusty-sage");

    // Poker shows card suits, check for absence
    assert.ok(!output.includes("A♠") && !output.includes("K♥"));
  });
});
