/**
 * Unit tests for CwdWidget
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { CwdWidget } from "../../../src/widgets/cwd/index.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";
import { stripAnsi } from "../../helpers/snapshot.js";

describe("CwdWidget", () => {
  describe("initialization", () => {
    it("should have correct id", () => {
      const widget = new CwdWidget();
      expect(widget.id).to.equal("cwd");
    });

    it("should have correct metadata", () => {
      const widget = new CwdWidget();
      expect(widget.metadata.name).to.equal("CWD");
      expect(widget.metadata.description).to.equal("Displays current working directory");
      expect(widget.metadata.version).to.equal("1.0.0");
      expect(widget.metadata.author).to.equal("claude-scope");
    });

    it("should be enabled by default", async () => {
      const widget = new CwdWidget();
      await widget.initialize({ config: {} });
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("render", () => {
    it("should return shortened path in minimal style (default)", async () => {
      const widget = new CwdWidget();
      await widget.update(createMockStdinData({ cwd: "/other/projects/claude-scope" }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Without HOME set, just shortens middle parts
      expect(stripAnsi(result || "")).to.include("claude-scope");
    });

    it("should return null when cwd is missing", async () => {
      const widget = new CwdWidget();
      await widget.update(createMockStdinData({ cwd: undefined }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should handle root directory", async () => {
      const widget = new CwdWidget();
      await widget.update(createMockStdinData({ cwd: "/" }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(stripAnsi(result || "")).to.equal("/");
    });

    it("should return null when render called before update", async () => {
      const widget = new CwdWidget();

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });
  });

  describe("widget contract", () => {
    it("should implement all required methods", async () => {
      const widget = new CwdWidget();

      expect(typeof widget.initialize).to.equal("function");
      expect(typeof widget.update).to.equal("function");
      expect(typeof widget.render).to.equal("function");
      expect(typeof widget.isEnabled).to.equal("function");
    });

    it("should work with widget registry lifecycle", async () => {
      const widget = new CwdWidget();

      await widget.initialize({ config: {} });
      await widget.update(createMockStdinData({ cwd: "/test/project" }));
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a("string");
    });
  });

  describe("enabled state", () => {
    it("should respect enabled config", async () => {
      const widget = new CwdWidget();
      await widget.initialize({ config: { enabled: false } });

      expect(widget.isEnabled()).to.be.false;
    });

    it("should return null when disabled", async () => {
      const widget = new CwdWidget();
      await widget.initialize({ config: { enabled: false } });
      await widget.update(createMockStdinData({ cwd: "/test/project" }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });
  });

  describe("style renderers", () => {
    const testCwd = "/Users/demo/projects/claude-scope";

    describe("minimal style (default)", () => {
      it("should shorten path", async () => {
        const widget = new CwdWidget();
        widget.setStyle("minimal");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });
        const stripped = stripAnsi(result || "");

        // Should end with full directory name
        expect(stripped).to.include("claude-scope");
        // Should be shorter than full path
        expect(stripped.length).to.be.lessThan(testCwd.length);
      });
    });

    describe("balanced style", () => {
      it("should render directory name only", async () => {
        const widget = new CwdWidget();
        widget.setStyle("balanced");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("claude-scope");
      });
    });

    describe("compact style", () => {
      it("should render directory name only (same as balanced)", async () => {
        const widget = new CwdWidget();
        widget.setStyle("compact");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("claude-scope");
      });
    });

    describe("playful style", () => {
      it("should render with folder emoji", async () => {
        const widget = new CwdWidget();
        widget.setStyle("playful");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("📁 claude-scope");
      });
    });

    describe("technical style", () => {
      it("should render full path", async () => {
        const widget = new CwdWidget();
        widget.setStyle("technical");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("/Users/demo/projects/claude-scope");
      });
    });

    describe("symbolic style", () => {
      it("should render with diamond symbol", async () => {
        const widget = new CwdWidget();
        widget.setStyle("symbolic");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("◆ claude-scope");
      });
    });

    describe("labeled style", () => {
      it('should render with "Dir:" prefix', async () => {
        const widget = new CwdWidget();
        widget.setStyle("labeled");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("Dir: claude-scope");
      });
    });

    describe("indicator style", () => {
      it("should render with bullet indicator", async () => {
        const widget = new CwdWidget();
        widget.setStyle("indicator");
        await widget.update(createMockStdinData({ cwd: testCwd }));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("● claude-scope");
      });
    });

    describe("style switching", () => {
      it("should switch between styles dynamically", async () => {
        const widget = new CwdWidget();
        await widget.update(createMockStdinData({ cwd: testCwd }));

        widget.setStyle("balanced");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "claude-scope"
        );

        widget.setStyle("playful");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "📁 claude-scope"
        );

        widget.setStyle("technical");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "/Users/demo/projects/claude-scope"
        );
      });

      it("should default to minimal for unknown styles", async () => {
        const widget = new CwdWidget();
        await widget.update(createMockStdinData({ cwd: testCwd }));

        // @ts-expect-error - testing invalid style
        widget.setStyle("unknown" as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        // Should still render something (minimal style stays)
        expect(result).to.not.be.null;
        expect(stripAnsi(result || "")).to.include("claude-scope");
      });
    });
  });

  describe("edge cases", () => {
    it("should handle single directory paths", async () => {
      const widget = new CwdWidget();
      widget.setStyle("balanced");
      await widget.update(createMockStdinData({ cwd: "/home" }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(stripAnsi(result || "")).to.equal("home");
    });

    it("should handle paths with special characters", async () => {
      const widget = new CwdWidget();
      widget.setStyle("balanced");
      await widget.update(createMockStdinData({ cwd: "/home/user/my-project_v2.0" }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(stripAnsi(result || "")).to.equal("my-project_v2.0");
    });

    it("should handle empty string cwd", async () => {
      const widget = new CwdWidget();
      await widget.update(createMockStdinData({ cwd: "" }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Empty string is falsy, should return null
      expect(result).to.be.null;
    });
  });
});
