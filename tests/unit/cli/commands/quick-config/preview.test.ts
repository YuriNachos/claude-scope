import assert from "node:assert";
import { describe, it } from "node:test";
import { renderPreview } from "../../../../../src/cli/commands/quick-config/preview.js";

describe("PreviewRenderer", () => {
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
