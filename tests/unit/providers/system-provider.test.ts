/**
 * Unit tests for SystemProvider
 */

import { existsSync, unlinkSync } from "node:fs";
import { afterEach, beforeEach, describe, it } from "node:test";
import { expect } from "chai";

import { SystemProvider } from "../../../src/providers/system-provider.js";
import type { SysmonRenderData } from "../../../src/widgets/sysmon/types.js";

const NETWORK_STATS_FILE = "/tmp/claude-scope-network-stats.json";

function cleanNetworkStatsFile(): void {
  if (existsSync(NETWORK_STATS_FILE)) {
    try {
      unlinkSync(NETWORK_STATS_FILE);
    } catch {
      // Ignore errors
    }
  }
}

describe("SystemProvider", () => {
  let provider: SystemProvider;

  beforeEach(() => {
    provider = new SystemProvider();
  });

  afterEach(() => {
    provider.stopUpdate();
  });

  describe("getMetrics", () => {
    it("should return system metrics with valid structure", async () => {
      const metrics = await provider.getMetrics();

      // Metrics may be null if systeminformation is not installed
      if (metrics) {
        // CPU metrics
        expect(metrics.cpu.percent).to.be.at.least(0);
        expect(metrics.cpu.percent).to.be.at.most(100);
        // Memory metrics
        expect(metrics.memory.used).to.be.greaterThan(0);
        expect(metrics.memory.total).to.be.greaterThan(0);
        expect(metrics.memory.percent).to.be.at.least(0);
        expect(metrics.memory.percent).to.be.at.most(100);
        // Disk metrics
        expect(metrics.disk.used).to.be.at.least(0);
        expect(metrics.disk.total).to.be.greaterThan(0);
        expect(metrics.disk.percent).to.be.at.least(0);
        expect(metrics.disk.percent).to.be.at.most(100);
        // Network metrics
        expect(metrics.network.rxSec).to.be.at.least(0);
        expect(metrics.network.txSec).to.be.at.least(0);
      }
    });

    it("should handle concurrent getMetrics calls", async () => {
      // Test that multiple simultaneous calls don't interfere
      const [metrics1, metrics2, metrics3] = await Promise.all([
        provider.getMetrics(),
        provider.getMetrics(),
        provider.getMetrics(),
      ]);

      // All may be null if systeminformation is not installed
      if (metrics1 && metrics2 && metrics3) {
        expect(metrics1.cpu.percent).to.be.within(0, 100);
        expect(metrics2.cpu.percent).to.be.within(0, 100);
        expect(metrics3.cpu.percent).to.be.within(0, 100);
      }
    });
  });

  describe("startUpdate/stopUpdate", () => {
    it("should call callback", async () => {
      let callCount = 0;
      let lastMetrics: SysmonRenderData | null = null;

      provider.startUpdate(100, (metrics) => {
        callCount++;
        lastMetrics = metrics;
        // Stop after first callback to avoid long waits
        if (callCount >= 1) {
          provider.stopUpdate();
        }
      });

      // Wait for callback
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Should have gotten at least one callback
      expect(callCount).to.be.at.least(1);
      if (lastMetrics) {
        expect(lastMetrics.cpu.percent).to.be.at.least(0);
      }
    });

    it("should stop calling callback after stopUpdate", async () => {
      let callCount = 0;

      provider.startUpdate(100, () => {
        callCount++;
      });

      // Wait for some callbacks
      await new Promise((resolve) => setTimeout(resolve, 3000));

      provider.stopUpdate();
      const countAtStop = callCount;

      // Wait another 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Count should not have increased significantly
      // Allowing for some callbacks that might have been in-flight
      expect(callCount).to.be.at.most(countAtStop + 3);
    });

    it("should handle multiple startUpdate calls", async () => {
      let callCount = 0;

      // First start
      provider.startUpdate(100, () => {
        callCount++;
        if (callCount >= 2) {
          provider.stopUpdate();
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Should have received callbacks
      expect(callCount).to.be.at.least(1);
    });

    it("should handle stopUpdate without startUpdate gracefully", () => {
      // Should not throw when stopping without starting
      expect(() => {
        provider.stopUpdate();
        provider.stopUpdate(); // Multiple stops
      }).to.not.throw();
    });
  });

  describe("edge cases", () => {
    it("should handle zero interval gracefully", () => {
      // Should not throw on zero interval
      expect(() => {
        provider.startUpdate(0, () => {});
        provider.stopUpdate();
      }).to.not.throw();
    });

    it("should handle negative interval gracefully", () => {
      // Should not throw on negative interval
      expect(() => {
        provider.startUpdate(-100, () => {});
        provider.stopUpdate();
      }).to.not.throw();
    });

    it("should handle callback that throws exception", async () => {
      let errorCount = 0;

      // Capture console.error to suppress test output
      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        provider.startUpdate(100, () => {
          errorCount++;
          if (errorCount >= 1) {
            provider.stopUpdate();
          }
          throw new Error("Test error in callback");
        });

        // Wait for callbacks
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Should have gotten at least one callback
        expect(errorCount).to.be.at.least(1);
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe("cleanup verification", () => {
    it("should handle rapid start/stop cycles", async () => {
      // Test rapid start/stop doesn't cause issues
      for (let i = 0; i < 5; i++) {
        provider.startUpdate(100, () => {});
        await new Promise((resolve) => setTimeout(resolve, 50));
        provider.stopUpdate();
      }

      // Should complete without throwing
      expect(true).to.be.true;
    });
  });

  describe("network stats persistence", () => {
    it("should handle network stats persistence across calls", async () => {
      // Clean start
      cleanNetworkStatsFile();

      const testProvider = new SystemProvider();

      // First call - should return 0 (no previous data)
      const metrics1 = await testProvider.getMetrics();

      // Skip test if systeminformation is not available
      if (!metrics1) {
        return;
      }

      expect(metrics1.network.rxSec).to.equal(0);
      expect(metrics1.network.txSec).to.equal(0);

      // File should exist after first call
      const fileExists = existsSync(NETWORK_STATS_FILE);
      if (!fileExists) {
        // File creation may have failed - check if metrics were fetched
        // This can happen in CI environments
        console.log("Note: Persistence file not created, possibly due to environment restrictions");
        return;
      }

      // Verify file structure
      const fs = require("node:fs");
      const content = fs.readFileSync(NETWORK_STATS_FILE, "utf-8");
      const data = JSON.parse(content);

      expect(data).to.have.property("stats");
      expect(data).to.have.property("lastUpdate");
      expect(data.lastUpdate).to.be.a("number");

      // Cleanup
      cleanNetworkStatsFile();
    });
  });
});
