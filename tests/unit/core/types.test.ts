import { describe, it } from "node:test";
import { expect } from "chai";
import type { IWidget } from "../../../src/core/types.js";

describe("IWidget", () => {
  it("should define required interface methods", () => {
    // This is a type-level test - ensures interface exists and is correct
    const widgetMock: IWidget = {
      id: "test-widget",
      metadata: {
        name: "Test Widget",
        description: "A test widget",
        version: "1.0.0",
        author: "Test",
      },
      initialize: async () => {},
      render: async () => "test output",
      update: async () => {},
      isEnabled: () => true,
    };

    expect(widgetMock.id).to.equal("test-widget");
    expect(widgetMock.metadata.name).to.equal("Test Widget");
    expect(typeof widgetMock.initialize).to.equal("function");
    expect(typeof widgetMock.render).to.equal("function");
    expect(typeof widgetMock.update).to.equal("function");
    expect(typeof widgetMock.isEnabled).to.equal("function");
  });

  it("should allow optional cleanup method", () => {
    const widgetWithCleanup: IWidget = {
      id: "test-widget",
      metadata: {
        name: "Test Widget",
        description: "A test widget",
        version: "1.0.0",
        author: "Test",
      },
      initialize: async () => {},
      render: async () => null,
      update: async () => {},
      isEnabled: () => false,
      cleanup: async () => {},
    };

    expect(widgetWithCleanup.cleanup).to.exist;
  });
});
