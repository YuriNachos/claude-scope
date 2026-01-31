import assert from "node:assert";
import { describe, it } from "node:test";
import { generateDefaultConfig } from "../../../src/config/default-config.js";

describe("DefaultConfig", () => {
  it("should generate valid ScopeConfig", () => {
    const config = generateDefaultConfig();

    assert.strictEqual(config.version, "1.0.0");
    assert.ok(config.lines["0"]);
    assert.ok(config.lines["1"]);
    assert.ok(config.lines["2"]);
  });

  it("should have empty-line widget on line 4", () => {
    const config = generateDefaultConfig();
    assert.ok(config.lines["4"]);
    assert.strictEqual(config.lines["4"].length, 1);
    const emptyLineWidget = config.lines["4"][0];
    assert.strictEqual(emptyLineWidget.id, "empty-line");
  });

  it("should have model widget with balanced style", () => {
    const config = generateDefaultConfig();
    const modelWidget = config.lines["0"].find((w) => w.id === "model");

    assert.ok(modelWidget);
    assert.strictEqual(modelWidget.style, "balanced");
  });

  it("should use ANSI color codes", () => {
    const config = generateDefaultConfig();
    const modelWidget = config.lines["0"].find((w) => w.id === "model")!;

    assert.ok(modelWidget.colors.name.startsWith("\u001b["));
  });

  it("should include all widgets on line 0", () => {
    const config = generateDefaultConfig();
    const line0 = config.lines["0"];

    const widgetIds = line0.map((w) => w.id);
    assert.ok(widgetIds.includes("model"));
    assert.ok(widgetIds.includes("context"));
    assert.ok(widgetIds.includes("cost"));
    assert.ok(widgetIds.includes("lines"));
    assert.ok(widgetIds.includes("duration"));
    assert.ok(widgetIds.includes("git"));
  });

  it("should include all widgets on line 1", () => {
    const config = generateDefaultConfig();
    const line1 = config.lines["1"];

    const widgetIds = line1.map((w) => w.id);
    assert.ok(widgetIds.includes("git-tag"));
    assert.ok(widgetIds.includes("config-count"));
  });

  it("should include all widgets on line 2", () => {
    const config = generateDefaultConfig();
    const line2 = config.lines["2"];

    const widgetIds = line2.map((w) => w.id);
    assert.ok(widgetIds.includes("active-tools"));
    assert.ok(widgetIds.includes("cache-metrics"));
  });

  it("should have all widgets with balanced style", () => {
    const config = generateDefaultConfig();

    for (const lineKey in config.lines) {
      for (const widget of config.lines[lineKey]) {
        // empty-line widget doesn't have style property
        if (widget.id === "empty-line") {
          continue;
        }
        assert.strictEqual(
          widget.style,
          "balanced",
          `Widget ${widget.id} should have balanced style`
        );
      }
    }
  });

  it("should have proper color structure for each widget", () => {
    const config = generateDefaultConfig();

    // Model widget should have name and version colors
    const modelWidget = config.lines["0"].find((w) => w.id === "model")!;
    assert.ok("name" in modelWidget.colors);
    assert.ok("version" in modelWidget.colors);

    // Context widget should have low, medium, high, bar colors
    const contextWidget = config.lines["0"].find((w) => w.id === "context")!;
    assert.ok("low" in contextWidget.colors);
    assert.ok("medium" in contextWidget.colors);
    assert.ok("high" in contextWidget.colors);
    assert.ok("bar" in contextWidget.colors);

    // Git widget should have branch and changes colors
    const gitWidget = config.lines["0"].find((w) => w.id === "git")!;
    assert.ok("branch" in gitWidget.colors);
    assert.ok("changes" in gitWidget.colors);

    // Active tools widget should have running, completed, error, name, target, count
    const activeToolsWidget = config.lines["2"].find((w) => w.id === "active-tools")!;
    assert.ok("running" in activeToolsWidget.colors);
    assert.ok("completed" in activeToolsWidget.colors);
    assert.ok("error" in activeToolsWidget.colors);
    assert.ok("name" in activeToolsWidget.colors);
    assert.ok("target" in activeToolsWidget.colors);
    assert.ok("count" in activeToolsWidget.colors);
  });

  it("should have 6 widgets on line 0", () => {
    const config = generateDefaultConfig();
    assert.strictEqual(config.lines["0"].length, 6);
  });

  it("should have 2 widgets on line 1", () => {
    const config = generateDefaultConfig();
    assert.strictEqual(config.lines["1"].length, 2);
  });

  it("should have 2 widgets on line 2", () => {
    const config = generateDefaultConfig();
    assert.strictEqual(config.lines["2"].length, 2);
  });

  it("should have sysmon widget on line 3", () => {
    const config = generateDefaultConfig();
    assert.ok(config.lines["3"]);
    assert.strictEqual(config.lines["3"].length, 1);
    const sysmonWidget = config.lines["3"][0];
    assert.strictEqual(sysmonWidget.id, "sysmon");
  });

  it("should have empty-line widget on line 4", () => {
    const config = generateDefaultConfig();
    assert.ok(config.lines["4"]);
    assert.strictEqual(config.lines["4"].length, 1);
    const emptyLineWidget = config.lines["4"][0];
    assert.strictEqual(emptyLineWidget.id, "empty-line");
  });

  it("should have git-tag widget with branch color field", () => {
    const config = generateDefaultConfig();
    const gitTagWidget = config.lines["1"].find((w) => w.id === "git-tag")!;
    assert.ok("branch" in gitTagWidget.colors, "git-tag should have branch color");
  });

  it("should have config-count widget with label and separator color fields", () => {
    const config = generateDefaultConfig();
    const configCountWidget = config.lines["1"].find((w) => w.id === "config-count")!;
    assert.ok("label" in configCountWidget.colors, "config-count should have label color");
    assert.ok("separator" in configCountWidget.colors, "config-count should have separator color");
  });
});
