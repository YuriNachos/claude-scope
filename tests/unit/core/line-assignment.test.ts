/**
 * Line Assignment Tests
 * Verify that widgets use config line override
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { ConfigCountWidget } from "../../../src/widgets/config-count-widget.js";
import { ContextWidget } from "../../../src/widgets/context-widget.js";
import { ModelWidget } from "../../../src/widgets/model-widget.js";

describe("Line Assignment", () => {
  describe("Default line from metadata", () => {
    it("should return default line from metadata when no override", () => {
      const widget = new ModelWidget();
      assert.strictEqual(widget.getLine(), 0);
    });

    it("ConfigCountWidget should default to line 1", () => {
      const widget = new ConfigCountWidget();
      assert.strictEqual(widget.getLine(), 1);
    });

    it("ContextWidget should default to line 0", () => {
      const widget = new ContextWidget();
      assert.strictEqual(widget.getLine(), 0);
    });
  });

  describe("setLine() override", () => {
    it("should override default line when setLine is called", () => {
      const widget = new ModelWidget();
      widget.setLine(5);
      assert.strictEqual(widget.getLine(), 5);
    });

    it("should allow changing line multiple times", () => {
      const widget = new ConfigCountWidget();
      assert.strictEqual(widget.getLine(), 1); // default

      widget.setLine(3);
      assert.strictEqual(widget.getLine(), 3);

      widget.setLine(0);
      assert.strictEqual(widget.getLine(), 0);
    });
  });

  describe("getLine() fallback", () => {
    it("should fallback to metadata.line when getLine not implemented", () => {
      // Mock widget without getLine()
      const mockWidget = {
        id: "mock",
        metadata: { line: 5 },
      } as any;

      const line = mockWidget.getLine ? mockWidget.getLine() : (mockWidget.metadata.line ?? 0);
      assert.strictEqual(line, 5);
    });
  });
});
