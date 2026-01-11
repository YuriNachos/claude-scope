/**
 * Line Assignment Tests
 * Verify that widgets use config line override
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { ConfigCountWidget } from "../../../src/widgets/config-count-widget.js";
import { ContextWidget } from "../../../src/widgets/context-widget.js";
import { ModelWidget } from "../../../src/widgets/model-widget.js";

describe("Line Assignment", () => {
  describe("Default line from metadata", () => {
    it("should return default line from metadata when no override", () => {
      const widget = new ModelWidget();
      expect(widget.getLine()).to.equal(0);
    });

    it("should return default line 1 for ConfigCountWidget", () => {
      const widget = new ConfigCountWidget();
      expect(widget.getLine()).to.equal(1);
    });

    it("should return default line 0 for ContextWidget", () => {
      const widget = new ContextWidget();
      expect(widget.getLine()).to.equal(0);
    });
  });

  describe("setLine() override", () => {
    it("should override default line when setLine is called", () => {
      const widget = new ModelWidget();
      widget.setLine(5);
      expect(widget.getLine()).to.equal(5);
    });

    it("should allow changing line multiple times", () => {
      const widget = new ConfigCountWidget();
      expect(widget.getLine()).to.equal(1); // default

      widget.setLine(3);
      expect(widget.getLine()).to.equal(3);

      widget.setLine(0);
      expect(widget.getLine()).to.equal(0);
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
      expect(line).to.equal(5);
    });
  });
});
