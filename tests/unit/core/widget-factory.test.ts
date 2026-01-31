import { describe, it } from "node:test";
import { expect } from "chai";
import { WidgetFactory } from "../../../src/core/widget-factory.js";
import { NORD_THEME } from "../../../src/ui/theme/index.js";
import { ActiveToolsWidget } from "../../../src/widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../../../src/widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../../../src/widgets/config-count-widget.js";
import { ContextWidget } from "../../../src/widgets/context-widget.js";
import { CostWidget } from "../../../src/widgets/cost-widget.js";
import { DurationWidget } from "../../../src/widgets/duration-widget.js";
import { GitTagWidget } from "../../../src/widgets/git/git-tag-widget.js";
import { GitWidget } from "../../../src/widgets/git/git-widget.js";
import { LinesWidget } from "../../../src/widgets/lines-widget.js";
import { ModelWidget } from "../../../src/widgets/model-widget.js";

describe("WidgetFactory", () => {
  it("should return ModelWidget for 'model' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("model");

    expect(widget).to.be.instanceOf(ModelWidget);
    expect(widget?.id).to.equal("model");
  });

  it("should return ContextWidget for 'context' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("context");

    expect(widget).to.be.instanceOf(ContextWidget);
    expect(widget?.id).to.equal("context");
  });

  it("should return CostWidget for 'cost' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("cost");

    expect(widget).to.be.instanceOf(CostWidget);
    expect(widget?.id).to.equal("cost");
  });

  it("should return LinesWidget for 'lines' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("lines");

    expect(widget).to.be.instanceOf(LinesWidget);
    expect(widget?.id).to.equal("lines");
  });

  it("should return DurationWidget for 'duration' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("duration");

    expect(widget).to.be.instanceOf(DurationWidget);
    expect(widget?.id).to.equal("duration");
  });

  it("should return GitWidget for 'git' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("git");

    expect(widget).to.be.instanceOf(GitWidget);
    expect(widget?.id).to.equal("git");
  });

  it("should return GitTagWidget for 'git-tag' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("git-tag");

    expect(widget).to.be.instanceOf(GitTagWidget);
    expect(widget?.id).to.equal("git-tag");
  });

  it("should return ConfigCountWidget for 'config-count' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("config-count");

    expect(widget).to.be.instanceOf(ConfigCountWidget);
    expect(widget?.id).to.equal("config-count");
  });

  it("should return CacheMetricsWidget with theme for 'cache-metrics' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("cache-metrics");

    expect(widget).to.not.be.null;
    expect(widget).to.be.instanceOf(CacheMetricsWidget);
    expect(widget?.id).to.equal("cache-metrics");
  });

  it("should return ActiveToolsWidget with dependencies for 'active-tools' id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("active-tools");

    expect(widget).to.not.be.null;
    expect(widget).to.be.instanceOf(ActiveToolsWidget);
    expect(widget?.id).to.equal("active-tools");
  });

  it("should return null for unknown widget id", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("unknown-widget");

    expect(widget).to.be.null;
  });

  it("should return list of all supported widget IDs", () => {
    const factory = new WidgetFactory();
    const supportedIds = factory.getSupportedWidgetIds();

    expect(supportedIds).to.be.an("array");
    expect(supportedIds).to.include.members([
      "model",
      "context",
      "cost",
      "lines",
      "duration",
      "git",
      "git-tag",
      "config-count",
      "cache-metrics",
      "active-tools",
    ]);
  });

  it("should accept custom theme in constructor", () => {
    const factory = new WidgetFactory(NORD_THEME.colors);
    const widget = factory.createWidget("model");

    expect(widget).to.not.be.null;
    expect(widget?.id).to.equal("model");
  });

  it("should use default theme when none provided", () => {
    const factory = new WidgetFactory();
    const widget = factory.createWidget("context");

    expect(widget).to.not.be.null;
    expect(widget?.id).to.equal("context");
  });
});
