/**
 * Tests for SysmonWidget
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import type { ISystemProvider } from "../../../src/providers/system-provider.js";
import { DEFAULT_THEME } from "../../../src/ui/theme/index.js";
import type { SysmonRenderData } from "../../../src/widgets/sysmon/types.js";
import { SysmonWidget } from "../../../src/widgets/sysmon-widget.js";

function createMockProvider(metrics: SysmonRenderData | null): ISystemProvider {
  return {
    getMetrics: async () => metrics,
    startUpdate: () => {},
    stopUpdate: () => {},
  };
}

describe("SysmonWidget", () => {
  describe("metadata", () => {
    it("should have correct id", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, createMockProvider(null));
      assert.strictEqual(widget.id, "sysmon");
    });

    it("should have correct metadata", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, createMockProvider(null));
      assert.strictEqual(widget.metadata.name, "Sysmon");
      assert.ok(widget.metadata.description.toLowerCase().includes("system"));
    });
  });

  describe("initialize", () => {
    it("should start background updates on initialize", async () => {
      const mockMetrics: SysmonRenderData = {
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rxSec: 1, txSec: 0.5 },
      };
      const provider = createMockProvider(mockMetrics);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      // Widget should now have metrics
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(result);
    });
  });

  describe("render", () => {
    it("should render balanced style by default", async () => {
      const mockMetrics: SysmonRenderData = {
        cpu: { percent: 45 },
        memory: { used: 8.2, total: 16, percent: 51 },
        disk: { used: 120, total: 200, percent: 60 },
        network: { rxSec: 2.1, txSec: 0.5 },
      };
      const provider = createMockProvider(mockMetrics);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      assert.ok(result.includes("CPU 45%"));
      assert.ok(result.includes("RAM 8.2GB"));
      assert.ok(result.includes("Disk 60%"));
    });

    it("should return null when provider returns null", async () => {
      const provider = createMockProvider(null);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      assert.strictEqual(result, null);
    });

    it("should respect style changes", async () => {
      const mockMetrics: SysmonRenderData = {
        cpu: { percent: 45 },
        memory: { used: 8.2, total: 16, percent: 51 },
        disk: { used: 120, total: 200, percent: 60 },
        network: { rxSec: 2.1, txSec: 0.5 },
      };
      const provider = createMockProvider(mockMetrics);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      widget.setStyle("compact");
      let result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(!result.includes("|"));

      widget.setStyle("playful");
      result = await widget.render({ width: 80, timestamp: Date.now() });
      assert.ok(result.includes("🖥️"));
    });

    it("should support line override", async () => {
      const provider = createMockProvider({
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rxSec: 1, txSec: 0.5 },
      });
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      widget.setLine(3);
      assert.strictEqual(widget.getLine(), 3);
    });
  });

  describe("isEnabled", () => {
    it("should return true when provider is available", () => {
      const provider = createMockProvider({
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rxSec: 1, txSec: 0.5 },
      });
      const widget = new SysmonWidget(DEFAULT_THEME, provider);
      assert.strictEqual(widget.isEnabled(), true);
    });

    it("should return false when provider is null", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, null as any);
      assert.strictEqual(widget.isEnabled(), false);
    });
  });

  describe("cleanup", () => {
    it("should stop updates on cleanup", async () => {
      const provider = createMockProvider({
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rxSec: 1, txSec: 0.5 },
      });
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      // Cleanup should not throw
      await widget.cleanup();
      assert.ok(true);
    });
  });
});
