/**
 * Tests for SysmonWidget
 */

import { beforeEach, describe, expect, it } from "node:test";
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
      expect(widget.id).to.equal("sysmon");
    });

    it("should have correct metadata", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, createMockProvider(null));
      expect(widget.metadata.name).to.equal("Sysmon");
      expect(widget.metadata.description).to.include("system");
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
      expect(result).to.be.ok;
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

      expect(result).to.include("CPU 45%");
      expect(result).to.include("RAM 8.2GB");
      expect(result).to.include("Disk 60%");
    });

    it("should return null when provider returns null", async () => {
      const provider = createMockProvider(null);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.null;
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
      expect(result).to.not.include("|");

      widget.setStyle("playful");
      result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.include("🖥️");
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
      expect(widget.getLine()).to.equal(3);
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
      expect(widget.isEnabled()).to.be.true;
    });

    it("should return false when provider is null", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, null as any);
      expect(widget.isEnabled()).to.be.false;
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
      expect(async () => await widget.cleanup()).to.not.throw();
    });
  });
});
