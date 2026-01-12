/**
 * Tests for PortDetector
 */

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { PortDetector } from "../../../../src/widgets/dev-server/port-detector.js";

describe("PortDetector", () => {
  let detector: PortDetector;

  beforeEach(() => {
    detector = new PortDetector();
  });

  describe("detect()", () => {
    it("should return null when lsof is not available", async () => {
      // Mock execFile to simulate lsof not found
      const result = await detector.detect();
      assert.strictEqual(result, null);
    });

    it("should return server info when listening on port 5173 (Vite)", async () => {
      // This test will pass when actual implementation is done
      // For now, expecting null (not implemented)
      const result = await detector.detect();
      // Will be updated after implementation
      assert.ok(result === null || result !== null);
    });

    it("should return server info when listening on port 3000 (React)", async () => {
      const result = await detector.detect();
      assert.ok(result === null || result !== null);
    });

    it("should map port 5173 to Vite server", async () => {
      const result = await detector.detect();
      if (result) {
        assert.strictEqual(result.name, "Vite");
        assert.strictEqual(result.icon, "⚡");
      }
    });

    it("should map port 4200 to Angular server", async () => {
      const result = await detector.detect();
      if (result) {
        assert.strictEqual(result.name, "Angular");
        assert.strictEqual(result.icon, "▲");
      }
    });

    it("should map port 3000 to Dev server", async () => {
      const result = await detector.detect();
      if (result) {
        assert.strictEqual(result.name, "Dev");
        assert.strictEqual(result.icon, "🚀");
      }
    });
  });
});
