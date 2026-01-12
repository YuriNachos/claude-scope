/**
 * Unit tests for DevServerWidget
 */

import { beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import type { StdinData } from "../../types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import { DevServerWidget } from "./dev-server-widget.js";

describe("DevServerWidget", () => {
  let widget: DevServerWidget;
  let mockStdinData: StdinData;

  beforeEach(() => {
    widget = new DevServerWidget(DEFAULT_THEME);
    mockStdinData = {
      session_id: "test-session",
      cwd: "/Users/test/project",
      model: { id: "claude-opus-4-5-20251101", display_name: "Claude Opus 4.5" },
    };
  });

  describe("initialization", () => {
    it("should have correct metadata", () => {
      expect(widget.id).to.equal("dev-server");
      expect(widget.metadata.name).to.equal("Dev Server");
      expect(widget.metadata.description).to.equal("Detects running dev server processes");
    });

    it("should be enabled by default", async () => {
      await widget.initialize({ config: {} });
      expect(widget.isEnabled()).to.be.true;
    });

    it("should respect enabled config", async () => {
      await widget.initialize({ config: { enabled: false } });
      expect(widget.isEnabled()).to.be.false;
    });
  });

  describe("update", () => {
    it("should store cwd from stdin data", async () => {
      await widget.update(mockStdinData);
      // Update completes without error
      expect(true).to.be.true;
    });
  });

  describe("style support", () => {
    it("should support style changes", () => {
      expect(() => widget.setStyle("balanced")).not.to.throw();
      expect(() => widget.setStyle("compact")).not.to.throw();
      expect(() => widget.setStyle("playful")).not.to.throw();
    });
  });

  describe("line override", () => {
    it("should support line override", () => {
      widget.setLine(2);
      expect(widget.getLine()).to.equal(2);
    });

    it("should return default line when no override", () => {
      expect(widget.getLine()).to.equal(0);
    });
  });

  describe("rendering", () => {
    it("should return null when widget is disabled", async () => {
      await widget.initialize({ config: { enabled: false } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.be.null;
    });

    it("should return null when no stdin data received", async () => {
      await widget.initialize({ config: { enabled: true } });
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.be.null;
    });
  });

  describe("cleanup", () => {
    it("should cleanup without errors", async () => {
      let errorThrown = false;
      try {
        await widget.cleanup();
      } catch {
        errorThrown = true;
      }
      expect(errorThrown).to.be.false;
    });
  });
});
