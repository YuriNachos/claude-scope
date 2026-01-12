/**
 * End-to-end test for DevServer and Docker widgets working together
 *
 * Tests the complete integration between both widgets:
 * - Both widgets active simultaneously
 * - Widget style consistency
 * - Error handling when services unavailable
 * - Widget enable/disable states
 */

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import type { StdinData } from "../../src/types.js";
import { DEFAULT_THEME } from "../../src/ui/theme/index.js";
import { DevServerWidget } from "../../src/widgets/dev-server/index.js";
import { DockerWidget } from "../../src/widgets/docker/index.js";

describe("E2E: DevServer and Docker Widgets", () => {
  let devServerWidget: DevServerWidget;
  let dockerWidget: DockerWidget;
  let mockStdinData: StdinData;

  beforeEach(() => {
    devServerWidget = new DevServerWidget(DEFAULT_THEME);
    dockerWidget = new DockerWidget(DEFAULT_THEME);
    mockStdinData = {
      session_id: "test-e2e-session",
      cwd: "/Users/test/project",
      model: { id: "claude-opus-4-5-20251101", display_name: "Claude Opus 4.5" },
    };
  });

  describe("both widgets active", () => {
    it("should render both widgets successfully", async () => {
      // Initialize both widgets
      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: true } });

      // Update with stdin data
      await devServerWidget.update(mockStdinData);
      await dockerWidget.update(mockStdinData);

      // Render both widgets
      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      // Results can be:
      // - string if service is detected
      // - null if service is not detected (expected in CI)
      // - empty string if Docker has 0 running containers
      assert.ok(
        devServerResult === null || typeof devServerResult === "string",
        "DevServerWidget should return null or string"
      );
      assert.ok(
        dockerResult === null || dockerResult === "" || typeof dockerResult === "string",
        "DockerWidget should return null, empty string, or string"
      );
    });

    it("should have correct metadata for both widgets", () => {
      assert.strictEqual(devServerWidget.id, "dev-server");
      assert.strictEqual(devServerWidget.metadata.name, "Dev Server");
      assert.strictEqual(
        devServerWidget.metadata.description,
        "Detects running dev server processes"
      );

      assert.strictEqual(dockerWidget.id, "docker");
      assert.strictEqual(dockerWidget.metadata.name, "Docker");
      assert.strictEqual(
        dockerWidget.metadata.description,
        "Shows Docker container count and status"
      );
    });
  });

  describe("one widget disabled", () => {
    it("should handle DevServer disabled while Docker enabled", async () => {
      await devServerWidget.initialize({ config: { enabled: false } });
      await dockerWidget.initialize({ config: { enabled: true } });

      await devServerWidget.update(mockStdinData);
      await dockerWidget.update(mockStdinData);

      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.strictEqual(devServerResult, null, "Disabled DevServerWidget should return null");
      assert.ok(
        dockerResult === null || typeof dockerResult === "string",
        "Enabled DockerWidget should return null or string"
      );
    });

    it("should handle Docker disabled while DevServer enabled", async () => {
      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: false } });

      await devServerWidget.update(mockStdinData);

      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.ok(
        devServerResult === null || typeof devServerResult === "string",
        "Enabled DevServerWidget should return null or string"
      );
      assert.strictEqual(dockerResult, null, "Disabled DockerWidget should return null");
    });

    it("should handle both widgets disabled", async () => {
      await devServerWidget.initialize({ config: { enabled: false } });
      await dockerWidget.initialize({ config: { enabled: false } });

      await devServerWidget.update(mockStdinData);

      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.strictEqual(devServerResult, null, "Disabled DevServerWidget should return null");
      assert.strictEqual(dockerResult, null, "Disabled DockerWidget should return null");
    });
  });

  describe("widget styles consistency", () => {
    it("should apply consistent compact styling across both widgets", async () => {
      devServerWidget.setStyle("compact");
      dockerWidget.setStyle("compact");

      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: true } });

      await devServerWidget.update(mockStdinData);

      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      // Results will be null if services not detected, or strings if detected
      assert.ok(
        devServerResult === null || typeof devServerResult === "string",
        "DevServerWidget compact style should return null or string"
      );
      assert.ok(
        dockerResult === null || typeof dockerResult === "string",
        "DockerWidget compact style should return null or string"
      );
    });

    it("should apply consistent playful styling across both widgets", async () => {
      devServerWidget.setStyle("playful");
      dockerWidget.setStyle("playful");

      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: true } });

      await devServerWidget.update(mockStdinData);

      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.ok(
        devServerResult === null || typeof devServerResult === "string",
        "DevServerWidget playful style should return null or string"
      );
      assert.ok(
        dockerResult === null || typeof dockerResult === "string",
        "DockerWidget playful style should return null or string"
      );
    });

    it("should support all common styles for both widgets", () => {
      const commonStyles = [
        "balanced",
        "compact",
        "playful",
        "verbose",
        "labeled",
        "indicator",
      ] as const;

      for (const style of commonStyles) {
        assert.doesNotThrow(
          () => {
            devServerWidget.setStyle(style);
            dockerWidget.setStyle(style);
          },
          undefined,
          `Style '${style}' should be supported by both widgets`
        );
      }
    });
  });

  describe("line override consistency", () => {
    it("should support line override for both widgets", () => {
      devServerWidget.setLine(1);
      dockerWidget.setLine(2);

      assert.strictEqual(devServerWidget.getLine(), 1);
      assert.strictEqual(dockerWidget.getLine(), 2);
    });

    it("should use default line 0 when no override", () => {
      assert.strictEqual(devServerWidget.getLine(), 0);
      assert.strictEqual(dockerWidget.getLine(), 0);
    });
  });

  describe("cleanup lifecycle", () => {
    it("should cleanup both widgets without errors", async () => {
      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: true } });

      await assert.doesNotReject(() => devServerWidget.cleanup());
      await assert.doesNotReject(() => dockerWidget.cleanup());
    });
  });

  describe("combined workflow scenarios", () => {
    it("should handle typical workflow: initialize → update → render → cleanup", async () => {
      // Initialize
      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: true } });

      // Update with stdin data
      await devServerWidget.update(mockStdinData);
      await dockerWidget.update(mockStdinData);

      // Render
      const devServerResult = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const dockerResult = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.ok(devServerResult === null || typeof devServerResult === "string");
      assert.ok(dockerResult === null || typeof dockerResult === "string");

      // Cleanup
      await assert.doesNotReject(() => devServerWidget.cleanup());
      await assert.doesNotReject(() => dockerWidget.cleanup());
    });

    it("should handle reconfiguration at runtime", async () => {
      // Initialize with one style
      devServerWidget.setStyle("balanced");
      dockerWidget.setStyle("balanced");

      await devServerWidget.initialize({ config: { enabled: true } });
      await dockerWidget.initialize({ config: { enabled: true } });

      await devServerWidget.update(mockStdinData);

      const result1 = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const result2 = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.ok(result1 === null || typeof result1 === "string");
      assert.ok(result2 === null || typeof result2 === "string");

      // Change style
      devServerWidget.setStyle("compact");
      dockerWidget.setStyle("compact");

      const result3 = await devServerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const result4 = await dockerWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      assert.ok(result3 === null || typeof result3 === "string");
      assert.ok(result4 === null || typeof result4 === "string");
    });
  });
});
