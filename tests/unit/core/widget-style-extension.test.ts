import assert from "node:assert";
import { describe, it } from "node:test";
import type { WidgetStyle } from "../../../src/core/style-types.js";
import type { IWidget } from "../../../src/core/types.js";

describe("IWidget setStyle extension", () => {
  it("should allow optional setStyle method on widget", () => {
    const mockWidget: IWidget = {
      id: "test-widget",
      metadata: {
        name: "Test Widget",
        description: "A test widget",
        version: "1.0.0",
        author: "test",
      },
      initialize: async () => {},
      render: async () => "test output",
      update: async () => {},
      isEnabled: () => true,
      setStyle: (style: WidgetStyle) => {
        (mockWidget as any).currentStyle = style;
      },
    };

    mockWidget.setStyle?.("compact");
    assert.equal((mockWidget as any).currentStyle, "compact");
  });

  it("should work without setStyle method", () => {
    const minimalWidget: IWidget = {
      id: "minimal-widget",
      metadata: {
        name: "Minimal Widget",
        description: "A minimal test widget",
        version: "1.0.0",
        author: "test",
      },
      initialize: async () => {},
      render: async () => "minimal output",
      update: async () => {},
      isEnabled: () => true,
    };

    assert.equal(minimalWidget.isEnabled(), true);
  });

  it("should accept all WidgetStyle values", () => {
    const styles: WidgetStyle[] = [
      "balanced",
      "compact",
      "playful",
      "verbose",
      "technical",
      "symbolic",
      "monochrome",
      "compact-verbose",
      "labeled",
      "indicator",
      "fancy",
    ];

    const widget: IWidget = {
      id: "style-test-widget",
      metadata: {
        name: "Style Test Widget",
        description: "Tests all styles",
        version: "1.0.0",
        author: "test",
      },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
      setStyle: (style: WidgetStyle) => {
        (widget as any).lastStyle = style;
      },
    };

    for (const style of styles) {
      widget.setStyle?.(style);
      assert.equal((widget as any).lastStyle, style);
    }
  });
});
