// tests/integration/rich-layout-structure.test.ts
import { describe, it } from "node:test";
import { expect } from "chai";
import { generateRichLayout } from "../../src/config/default-config.js";

describe("Rich Layout Structure", () => {
  it("should have lines widget on line 0 after cost widget", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Line 0 should exist
    expect(config.lines["0"]).to.exist;

    // Get widget IDs on line 0 in order
    const line0WidgetIds = config.lines["0"].map((w) => w.id);

    // Verify lines widget is on line 0
    expect(line0WidgetIds).to.include("lines");

    // Verify lines comes after cost
    const costIndex = line0WidgetIds.indexOf("cost");
    const linesIndex = line0WidgetIds.indexOf("lines");
    expect(linesIndex).to.be.greaterThan(costIndex, "lines should come after cost");

    // Expected order: model, context, cost, lines, duration
    expect(line0WidgetIds).to.deep.equal([
      "model",
      "context",
      "cost",
      "lines", // Moved from line 1 to line 0
      "duration",
    ]);
  });

  it("should NOT have lines widget on line 1", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Line 1 should exist
    expect(config.lines["1"]).to.exist;

    // Get widget IDs on line 1
    const line1WidgetIds = config.lines["1"].map((w) => w.id);

    // lines should NOT be on line 1
    expect(line1WidgetIds).to.not.include("lines");

    // Expected on line 1: git, git-tag, active-tools
    expect(line1WidgetIds).to.deep.equal(["git", "git-tag", "active-tools"]);
  });

  it("should maintain line 2 with cache-metrics and config-count", () => {
    const config = generateRichLayout("balanced", "monokai");

    const line2WidgetIds = config.lines["2"].map((w) => w.id);
    expect(line2WidgetIds).to.deep.equal(["cache-metrics", "config-count"]);
  });
});
