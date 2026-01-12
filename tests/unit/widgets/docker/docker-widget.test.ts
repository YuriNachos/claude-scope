/**
 * Tests for DockerWidget
 */

import { beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import type { StdinData } from "../../../../src/types.js";
import { DEFAULT_THEME } from "../../../../src/ui/theme/index.js";
import { DockerWidget } from "../../../../src/widgets/docker/docker-widget.js";

describe("DockerWidget", () => {
  let widget: DockerWidget;
  let mockStdinData: StdinData;

  beforeEach(() => {
    widget = new DockerWidget(DEFAULT_THEME);
    mockStdinData = {
      session_id: "test-session",
      cwd: "/Users/test/project",
      model: { id: "claude-opus-4-5-20251101", display_name: "Claude Opus 4.5" },
    };
  });

  describe("initialization", () => {
    it("should have correct metadata", () => {
      expect(widget.id).to.equal("docker");
      expect(widget.metadata.name).to.equal("Docker");
      expect(widget.metadata.description).to.equal("Shows Docker container count and status");
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

  describe("style support", () => {
    it("should support style changes", () => {
      expect(() => widget.setStyle("balanced")).not.to.throw();
      expect(() => widget.setStyle("compact")).not.to.throw();
      expect(() => widget.setStyle("playful")).not.to.throw();
    });
  });

  describe("line override", () => {
    it("should support line override", () => {
      widget.setLine(1);
      expect(widget.getLine()).to.equal(1);
    });

    it("should return default line when no override", () => {
      expect(widget.getLine()).to.equal(0);
    });
  });

  describe("rendering", () => {
    it("should return null when widget is disabled", async () => {
      await widget.initialize({ config: { enabled: false } });
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.be.null;
    });
  });

  describe("cleanup", () => {
    it("should cleanup without errors", async () => {
      await expect(widget.cleanup()).not.to.throw;
    });
  });
});
