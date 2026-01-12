// tests/integration/rich-layout-structure.test.ts
import { describe, it } from "node:test";
import { expect } from "chai";
import { generateRichLayout } from "../../src/config/default-config.js";

describe("Rich Layout Structure", () => {
  it("should have correct widgets on line 0", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Line 0 should exist
    expect(config.lines["0"]).to.exist;

    // Get widget IDs on line 0 in order
    const line0WidgetIds = config.lines["0"].map((w) => w.id);

    // Expected order: model, context, lines, cost, duration (5 widgets)
    expect(line0WidgetIds).to.deep.equal(["model", "context", "lines", "cost", "duration"]);

    // Verify correct count
    expect(line0WidgetIds).to.have.lengthOf(5);
  });

  it("should have correct widgets on line 1", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Line 1 should exist
    expect(config.lines["1"]).to.exist;

    // Get widget IDs on line 1
    const line1WidgetIds = config.lines["1"].map((w) => w.id);

    // Expected on line 1: git, git-tag, cache-metrics, config-count (4 widgets)
    expect(line1WidgetIds).to.deep.equal(["git", "git-tag", "cache-metrics", "config-count"]);

    // Verify correct count
    expect(line1WidgetIds).to.have.lengthOf(4);
  });

  it("should have correct widgets on line 2", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Line 2 should exist
    expect(config.lines["2"]).to.exist;

    // Get widget IDs on line 2
    const line2WidgetIds = config.lines["2"].map((w) => w.id);

    // Expected on line 2: dev-server, docker, active-tools (3 widgets)
    expect(line2WidgetIds).to.deep.equal(["dev-server", "docker", "active-tools"]);

    // Verify correct count
    expect(line2WidgetIds).to.have.lengthOf(3);
  });

  it("should have correct color structures for dev-server and docker", () => {
    const config = generateRichLayout("balanced", "monokai");

    // Find dev-server widget
    const devServerWidget = config.lines["2"].find((w) => w.id === "dev-server");
    expect(devServerWidget).to.exist;
    expect(devServerWidget!.colors).to.have.all.keys("name", "status", "label");

    // Find docker widget
    const dockerWidget = config.lines["2"].find((w) => w.id === "docker");
    expect(dockerWidget).to.exist;
    expect(dockerWidget!.colors).to.have.all.keys("label", "count", "running", "stopped");
  });
});
