/**
 * Tests for sysmon style functions
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { sysmonStyles } from "../../src/widgets/sysmon/styles.js";
import type { SysmonRenderData } from "../../src/widgets/sysmon/types.js";

const mockMetrics: SysmonRenderData = {
  cpu: { percent: 45 },
  memory: { used: 8.2, total: 16, percent: 51 },
  disk: { used: 120, total: 200, percent: 60 },
  network: { rxSec: 2.1, txSec: 0.5 },
};

const mockColors = {
  cpu: "#ff6b6b",
  ram: "#4ecdc4",
  disk: "#ffe66d",
  network: "#95e1d3",
  separator: "#6c757d",
};

describe("sysmonStyles", () => {
  describe("balanced", () => {
    it("should render all metrics with separator", () => {
      const result = sysmonStyles.balanced(mockMetrics, mockColors);
      expect(result).to.be.a("string");
      expect(result).to.include("CPU");
      expect(result).to.include("45%");
      expect(result).to.include("RAM");
      expect(result).to.include("8.2GB");
      expect(result).to.include("Disk");
      expect(result).to.include("60%");
      expect(result).to.include("Net");
      expect(result).to.include("↓2.1MB/s");
      expect(result).to.include("|");
    });

    it("should work without colors", () => {
      const result = sysmonStyles.balanced(mockMetrics);
      expect(result).to.be.ok;
      expect(result).to.have.length.greaterThan(0);
    });
  });

  describe("compact", () => {
    it("should render compact format without separator", () => {
      const result = sysmonStyles.compact(mockMetrics, mockColors);
      expect(result).to.include("CPU");
      expect(result).to.include("45%");
      expect(result).to.include("RAM");
      expect(result).to.include("8.2");
      expect(result).to.not.include("|");
    });
  });

  describe("playful", () => {
    it("should render with emojis", () => {
      const result = sysmonStyles.playful(mockMetrics, mockColors);
      expect(result).to.include("🖥️");
      expect(result).to.include("💾");
      expect(result).to.include("💿");
      expect(result).to.include("🌐");
    });
  });

  describe("verbose", () => {
    it("should render detailed format with totals", () => {
      const result = sysmonStyles.verbose(mockMetrics, mockColors);
      expect(result).to.include("CPU:");
      expect(result).to.include("RAM:");
      expect(result).to.include("8.2GB/16GB");
      expect(result).to.include("Disk:");
      expect(result).to.include("120GB/200GB");
      expect(result).to.include("Net:");
      expect(result).to.include("↓2.1MB/s");
      expect(result).to.include("↑0.5MB/s");
    });
  });

  describe("edge cases", () => {
    it("should format MB when RAM < 1GB", () => {
      const smallRam: SysmonRenderData = {
        ...mockMetrics,
        memory: { used: 0.5, total: 16, percent: 3 },
      };
      const result = sysmonStyles.balanced(smallRam, mockColors);
      expect(result).to.include("512MB");
    });

    it("should format KB when network < 1MB", () => {
      const smallNet: SysmonRenderData = {
        ...mockMetrics,
        network: { rxSec: 0.0005, txSec: 0 },
      };
      const result = sysmonStyles.balanced(smallNet, mockColors);
      expect(result).to.include("KB");
    });
  });
});
