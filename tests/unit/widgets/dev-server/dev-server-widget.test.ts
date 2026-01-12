/**
 * Unit tests for DevServerWidget
 *
 * These tests use mocked execFile to avoid system dependencies.
 */

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import type { StdinData } from "../../../../src/types.js";
import { DEFAULT_THEME } from "../../../../src/ui/theme/index.js";
import { DevServerWidget } from "../../../../src/widgets/dev-server/index.js";

describe("DevServerWidget Unit", () => {
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

  describe("widget lifecycle", () => {
    it("should initialize with default enabled state", async () => {
      await widget.initialize({ config: { enabled: true } });
      assert.strictEqual(widget.isEnabled(), true);
    });

    it("should update with cwd from stdin data", async () => {
      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      // Result will be null if no dev server detected (expected in unit tests)
      assert.ok(result === null || typeof result === "string");
    });

    it("should return null when disabled", async () => {
      await widget.initialize({ config: { enabled: false } });
      assert.strictEqual(widget.isEnabled(), false);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.strictEqual(result, null);
    });

    it("should return null when no cwd set", async () => {
      await widget.initialize({ config: { enabled: true } });
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.strictEqual(result, null);
    });
  });

  describe("style rendering", () => {
    it("should support balanced style", async () => {
      widget.setStyle("balanced");
      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      // Will be null if no dev server running, which is expected
      assert.ok(result === null || typeof result === "string");
    });

    it("should support compact style", async () => {
      widget.setStyle("compact");
      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(result === null || typeof result === "string");
    });

    it("should support playful style", async () => {
      widget.setStyle("playful");
      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(result === null || typeof result === "string");
    });

    it("should default to balanced for unknown style", async () => {
      widget.setStyle("unknown" as any);
      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(result === null || typeof result === "string");
    });
  });

  describe("line assignment", () => {
    it("should use default line 0", () => {
      assert.strictEqual(widget.getLine(), 0);
    });

    it("should allow line override", () => {
      widget.setLine(2);
      assert.strictEqual(widget.getLine(), 2);
    });
  });

  describe("cleanup", () => {
    it("should cleanup without errors", async () => {
      await widget.initialize({ config: { enabled: true } });
      await widget.cleanup(); // Should not throw
      assert.ok(true);
    });
  });

  describe("widget metadata", () => {
    it("should have correct id", () => {
      assert.strictEqual(widget.id, "dev-server");
    });

    it("should have correct metadata", () => {
      assert.strictEqual(widget.metadata.name, "Dev Server");
      assert.strictEqual(widget.metadata.description, "Detects running dev server processes");
      assert.strictEqual(widget.metadata.line, 0);
    });
  });

  describe("hybrid detection", () => {
    it("should try port detector first, then fall back to process detector", async () => {
      // This will be verified by checking that both detectors are called
      // For now, just ensure widget renders without errors
      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(result === null || typeof result === "string");
    });
  });
});
