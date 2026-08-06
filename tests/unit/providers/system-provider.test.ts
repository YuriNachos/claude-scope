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

// Fixed metrics used to stub SystemProvider#getMetrics in the startUpdate/stopUpdate
// tests below. Those tests exist to prove the interval-driving logic in
// startUpdate/stopUpdate, not the real systeminformation integration (that is covered
// by the "getMetrics" describe block above, which talks to the real module). Routing
// through the real module ties every interval tick to an OS subprocess call
// (sysctl/ioreg/WMI), which is why this file was racing real wall-clock on CI: a slow
// runner or a failed lazy import left the callback never firing inside the fixed sleep
// budget. Stubbing getMetrics on the instance (it's a plain prototype method, so an
// own-property assignment shadows it cleanly) makes every interval tick resolve
// deterministically in microseconds instead of depending on the OS and the network.
const STUB_METRICS: SysmonRenderData = {
  cpu: { percent: 42 },
  memory: { used: 8, total: 16, percent: 50 },
  disk: { used: 100, total: 200, percent: 50 },
  network: { rxSec: 1, txSec: 0.5 },
};

/**
 * Poll `predicate` until it returns true or `timeoutMs` elapses.
 *
 * Used in place of a fixed real-timer sleep so a startUpdate test finishes as soon as
 * its interval has ticked enough times, instead of always paying the full budget (and,
 * on a slow CI runner, sometimes not paying enough of it). On timeout this simply
 * returns - the caller's own assertion is what reports the failure, so the failure
 * message still names the actual expectation instead of a generic "waitFor timed out".
 */
async function waitFor(predicate: () => boolean, timeoutMs = 2000, pollMs = 5): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() >= deadline) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, pollMs));
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
      provider.getMetrics = async () => STUB_METRICS;

      provider.startUpdate(10, (metrics) => {
        callCount++;
        lastMetrics = metrics;
      });

      await waitFor(() => callCount >= 1);
      provider.stopUpdate();

      // Should have gotten at least one callback
      expect(callCount).to.be.at.least(1);
      expect(lastMetrics).to.not.equal(null);
      if (lastMetrics) {
        expect(lastMetrics.cpu.percent).to.be.at.least(0);
      }
    });

    it("should stop calling callback after stopUpdate", async () => {
      let callCount = 0;
      provider.getMetrics = async () => STUB_METRICS;

      provider.startUpdate(10, () => {
        callCount++;
      });

      // Wait for a few ticks before stopping
      await waitFor(() => callCount >= 3);

      provider.stopUpdate();
      const countAtStop = callCount;

      // Give any in-flight tick a chance to land, then confirm nothing new arrives
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Count should not have increased significantly
      // Allowing for some callbacks that might have been in-flight
      expect(callCount).to.be.at.most(countAtStop + 3);
    });

    it("should handle multiple startUpdate calls", async () => {
      let callCount = 0;
      provider.getMetrics = async () => STUB_METRICS;

      // First start
      provider.startUpdate(10, () => {
        callCount++;
        if (callCount >= 2) {
          provider.stopUpdate();
        }
      });

      await waitFor(() => callCount >= 2);

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
      provider.getMetrics = async () => STUB_METRICS;

      // Capture console.error to suppress test output
      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        provider.startUpdate(10, () => {
          errorCount++;
          throw new Error("Test error in callback");
        });

        // Deliberately do NOT stop after the first callback: a SECOND invocation
        // arriving after the first one threw is the proof that a throwing callback
        // does not kill the interval loop.
        await waitFor(() => errorCount >= 3);
        provider.stopUpdate();

        expect(errorCount).to.be.at.least(3);

        // The provider itself must still be usable afterwards - not left in a broken
        // state by callbacks that kept throwing.
        let recovered = false;
        provider.startUpdate(10, () => {
          recovered = true;
          provider.stopUpdate();
        });
        await waitFor(() => recovered);
        expect(recovered).to.be.true;
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe("cleanup verification", () => {
    it("should handle rapid start/stop cycles", async () => {
      provider.getMetrics = async () => STUB_METRICS;

      // Test rapid start/stop doesn't cause issues
      for (let i = 0; i < 5; i++) {
        provider.startUpdate(10, () => {});
        await new Promise((resolve) => setTimeout(resolve, 15));
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
