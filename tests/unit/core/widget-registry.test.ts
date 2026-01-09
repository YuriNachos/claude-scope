import { describe, it } from "node:test";
import { expect } from "chai";
import { WidgetRegistry } from "../../../src/core/widget-registry.js";
import { GitWidget } from "../../../src/widgets/git/git-widget.js";

describe("WidgetRegistry", () => {
  it("should register a widget", async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget();

    await registry.register(mockWidget);

    expect(registry.has("git")).to.be.true;
  });

  it("should register a widget with context", async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget();

    await registry.register(mockWidget, { config: { enabled: true } });

    expect(registry.has("git")).to.be.true;
    expect(mockWidget.isEnabled()).to.be.true;
  });

  it("should retrieve a registered widget", async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget();

    await registry.register(mockWidget);
    const retrieved = registry.get("git");

    expect(retrieved).to.equal(mockWidget);
  });

  it("should return all enabled widgets", async () => {
    const registry = new WidgetRegistry();
    const widget1 = new GitWidget();
    const widget2 = {
      id: "test",
      metadata: { name: "Test", description: "Test", version: "1.0.0", author: "Test" },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => false,
      cleanup: async () => {},
    };

    await registry.register(widget1);
    await registry.register(widget2 as any);

    const enabled = registry.getEnabledWidgets();

    expect(enabled).to.have.lengthOf(1);
    expect(enabled[0].id).to.equal("git");
  });

  it("should unregister a widget", async () => {
    const registry = new WidgetRegistry();
    const widget = new GitWidget();

    await registry.register(widget);
    expect(registry.has("git")).to.be.true;

    await registry.unregister("git");
    expect(registry.has("git")).to.be.false;
  });

  it("should throw when registering duplicate widget", async () => {
    const registry = new WidgetRegistry();
    const widget1 = new GitWidget();
    const widget2 = new GitWidget();

    await registry.register(widget1);

    let error: Error | null = null;
    try {
      await registry.register(widget2);
    } catch (e) {
      error = e as Error;
    }
    expect(error).to.exist;
    expect(error?.message).to.include("already registered");
  });

  it("should handle widget initialization error", async () => {
    const registry = new WidgetRegistry();
    const errorWidget = {
      id: "error",
      metadata: { name: "Error", description: "Test", version: "1.0.0", author: "Test" },
      initialize: async () => {
        throw new Error("Init failed");
      },
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
    };

    let error: Error | null = null;
    try {
      await registry.register(errorWidget as any, { config: {} });
    } catch (e) {
      error = e as Error;
    }
    expect(error).to.exist;
    expect(error?.message).to.equal("Init failed");
    expect(registry.has("error")).to.be.false;
  });

  it("should handle unregister of non-existent widget gracefully", async () => {
    const registry = new WidgetRegistry();

    await registry.unregister("nonexistent");
    expect(registry.has("nonexistent")).to.be.false;
  });

  it("should clear all widgets", async () => {
    const registry = new WidgetRegistry();
    const widget1 = new GitWidget();
    const widget2 = {
      id: "test2",
      metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
    };

    await registry.register(widget1);
    await registry.register(widget2 as any);
    expect(registry.getAll()).to.have.lengthOf(2);

    await registry.clear();
    expect(registry.getAll()).to.have.lengthOf(0);
  });

  it("should call cleanup on all widgets during clear", async () => {
    const registry = new WidgetRegistry();
    let cleanup1Called = false;
    let cleanup2Called = false;

    const widget1 = {
      id: "test1",
      metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
      cleanup: async () => {
        cleanup1Called = true;
      },
    };

    const widget2 = {
      id: "test2",
      metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
      cleanup: async () => {
        cleanup2Called = true;
      },
    };

    await registry.register(widget1 as any);
    await registry.register(widget2 as any);
    await registry.clear();

    expect(cleanup1Called).to.be.true;
    expect(cleanup2Called).to.be.true;
  });

  it("should propagate cleanup errors during clear", async () => {
    const registry = new WidgetRegistry();

    const widget1 = {
      id: "test1",
      metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
      cleanup: async () => {
        throw new Error("Cleanup failed");
      },
    };

    await registry.register(widget1 as any);

    let error: Error | null = null;
    try {
      await registry.clear();
    } catch (e) {
      error = e as Error;
    }

    expect(error).to.exist;
    expect(error?.message).to.equal("Cleanup failed");
    // Note: current implementation throws on first cleanup error
    // and doesn't complete clearing remaining widgets
  });
});
