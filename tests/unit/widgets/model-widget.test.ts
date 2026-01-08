/**
 * Unit tests for ModelWidget
 */

import { describe, it, beforeEach } from "node:test";
import { expect } from "chai";
import { ModelWidget } from "../../../src/widgets/model-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";

describe("ModelWidget", () => {
  describe("initialization", () => {
    it("should have correct id", () => {
      const widget = new ModelWidget();
      expect(widget.id).to.equal("model");
    });

    it("should have correct metadata", () => {
      const widget = new ModelWidget();
      expect(widget.metadata.name).to.equal("Model");
      expect(widget.metadata.description).to.equal("Displays the current Claude model name");
      expect(widget.metadata.version).to.equal("1.0.0");
      expect(widget.metadata.author).to.equal("claude-scope");
    });

    it("should be enabled by default", async () => {
      const widget = new ModelWidget();
      await widget.initialize({ config: {} });
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("render", () => {
    it("should return model display name", async () => {
      const widget = new ModelWidget();
      await widget.update(
        createMockStdinData({ model: { id: "claude-opus-4-5", display_name: "Opus 4.5" } })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.equal("Opus 4.5");
    });

    it("should return different model names", async () => {
      const widget = new ModelWidget();

      await widget.update(
        createMockStdinData({ model: { id: "claude-sonnet-4-1", display_name: "Sonnet 4.1" } })
      );
      expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("Sonnet 4.1");

      await widget.update(
        createMockStdinData({ model: { id: "claude-haiku-4-1", display_name: "Haiku 4.1" } })
      );
      expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("Haiku 4.1");
    });

    it("should handle model names with special characters", async () => {
      const widget = new ModelWidget();
      await widget.update(
        createMockStdinData({ model: { id: "test", display_name: "Claude-3.5-Sonnet (Beta)" } })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.equal("Claude-3.5-Sonnet (Beta)");
    });

    it("should return null when render called before update", async () => {
      const widget = new ModelWidget();

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Defensive programming: returns null instead of throwing
      expect(result).to.be.null;
    });

    it("should ignore render context width", async () => {
      const widget = new ModelWidget();
      await widget.update(
        createMockStdinData({ model: { id: "test", display_name: "Test Model" } })
      );

      const result1 = await widget.render({ width: 10, timestamp: 0 });
      const result2 = await widget.render({ width: 100, timestamp: 0 });

      expect(result1).to.equal(result2);
      expect(result1).to.equal("Test Model");
    });
  });

  describe("widget contract", () => {
    it("should implement all required methods", async () => {
      const widget = new ModelWidget();

      expect(typeof widget.initialize).to.equal("function");
      expect(typeof widget.update).to.equal("function");
      expect(typeof widget.render).to.equal("function");
      expect(typeof widget.isEnabled).to.equal("function");
    });

    it("should work with widget registry lifecycle", async () => {
      const widget = new ModelWidget();

      await widget.initialize({ config: {} });
      await widget.update(createMockStdinData());
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a("string");
    });
  });

  describe("enabled state", () => {
    it("should respect enabled config", async () => {
      const widget = new ModelWidget();
      await widget.initialize({ config: { enabled: false } });

      expect(widget.isEnabled()).to.be.false;
    });

    it("should return null when disabled", async () => {
      const widget = new ModelWidget();
      await widget.initialize({ config: { enabled: false } });
      await widget.update(createMockStdinData({ model: { id: "test", display_name: "Test" } }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Disabled widgets should not render
      expect(result).to.be.null;
    });
  });

  describe("style renderers", () => {
    const testData = {
      display_name: "Claude Opus 4.5",
      id: "claude-opus-4-5-20251101",
    };

    describe("balanced style", () => {
      it("should render full display name", async () => {
        const widget = new ModelWidget();
        widget.setStyle("balanced");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Claude Opus 4.5");
      });
    });

    describe("compact style", () => {
      it('should remove "Claude " prefix', async () => {
        const widget = new ModelWidget();
        widget.setStyle("compact");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Opus 4.5");
      });

      it('should handle names without "Claude " prefix', async () => {
        const widget = new ModelWidget();
        widget.setStyle("compact");
        await widget.update(createMockStdinData({ model: { display_name: "GPT-4", id: "gpt-4" } }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("GPT-4");
      });
    });

    describe("playful style", () => {
      it("should render with robot emoji", async () => {
        const widget = new ModelWidget();
        widget.setStyle("playful");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("🤖 Opus 4.5");
      });
    });

    describe("technical style", () => {
      it("should render model ID", async () => {
        const widget = new ModelWidget();
        widget.setStyle("technical");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("claude-opus-4-5-20251101");
      });
    });

    describe("symbolic style", () => {
      it("should render with diamond symbol", async () => {
        const widget = new ModelWidget();
        widget.setStyle("symbolic");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("◆ Opus 4.5");
      });
    });

    describe("labeled style", () => {
      it('should render with "Model:" prefix', async () => {
        const widget = new ModelWidget();
        widget.setStyle("labeled");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Model: Opus 4.5");
      });
    });

    describe("indicator style", () => {
      it("should render with bullet indicator", async () => {
        const widget = new ModelWidget();
        widget.setStyle("indicator");
        await widget.update(createMockStdinData({ model: testData }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("● Opus 4.5");
      });
    });

    describe("style switching", () => {
      it("should switch between styles dynamically", async () => {
        const widget = new ModelWidget();
        await widget.update(createMockStdinData({ model: testData }));

        widget.setStyle("balanced");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("Claude Opus 4.5");

        widget.setStyle("compact");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("Opus 4.5");

        widget.setStyle("technical");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal(
          "claude-opus-4-5-20251101"
        );
      });

      it("should default to balanced for unknown styles", async () => {
        const widget = new ModelWidget();
        await widget.update(createMockStdinData({ model: testData }));

        // @ts-expect-error - testing invalid style
        widget.setStyle("unknown" as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Claude Opus 4.5");
      });
    });
  });
});
