import { describe, it } from "node:test";
import { expect } from "chai";
import { WidgetRegistry } from "../../../src/core/widget-registry.js";
import { EmptyLineWidget } from "../../../src/widgets/empty-line-widget.js";

describe("WidgetRegistry - Duplicate Widget Support", () => {
  it("should allow multiple widgets with the same id", async () => {
    const registry = new WidgetRegistry();
    const widget1 = new EmptyLineWidget();
    const widget2 = new EmptyLineWidget();

    await registry.register(widget1);
    await registry.register(widget2);

    const all = registry.getAll();
    expect(all).to.have.lengthOf(2);
    expect(all[0].id).to.equal("empty-line");
    expect(all[1].id).to.equal("empty-line");
  });

  it("should handle widgets on different lines via getLine()", async () => {
    const registry = new WidgetRegistry();

    const widget1 = new EmptyLineWidget();
    widget1.setLine(3);

    const widget2 = new EmptyLineWidget();
    widget2.setLine(5);

    await registry.register(widget1);
    await registry.register(widget2);

    const all = registry.getAll();
    expect(all).to.have.lengthOf(2);
    expect(all[0].getLine()).to.equal(3);
    expect(all[1].getLine()).to.equal(5);
  });
});
