/**
 * Unit tests for SystemProvider
 *
 * NOTE: These tests are currently skipped because SystemProvider
 * implementation is not yet complete. Only the interface exists.
 *
 * These tests will be enabled during implementation phase, with:
 * - Mocked systeminformation module
 * - Full test coverage of error scenarios
 *
 * Current state: Test structure and edge cases documented
 */

import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { expect } from "chai";

// import { SystemProvider } from "../../../src/providers/system-provider.js";
// import type { SysmonRenderData } from "../../../src/widgets/sysmon/types.js";

describe.skip("SystemProvider", () => {
  // Uncomment when implementation is ready
  // let provider: SystemProvider;
  let originalSetInterval: typeof global.setInterval;
  let originalClearInterval: typeof global.clearInterval;
  let intervals: Set<NodeJS.Timeout>;

  beforeEach(() => {
    // Uncomment when implementation is ready
    // provider = new SystemProvider();
    intervals = new Set();

    // Mock timers for deterministic timing tests
    originalSetInterval = global.setInterval;
    originalClearInterval = global.clearInterval;

    global.setInterval = mock.fn((callback: () => void, ms: number) => {
      const id = originalSetInterval(callback, ms) as unknown as NodeJS.Timeout;
      intervals.add(id);
      return id;
    }) as unknown as typeof global.setInterval;

    global.clearInterval = mock.fn((id: NodeJS.Timeout) => {
      intervals.delete(id);
      return originalClearInterval(id);
    }) as unknown as typeof global.clearInterval;
  });

  afterEach(() => {
    // Uncomment when implementation is ready
    // provider.stopUpdate();

    // Restore original timers
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;

    // Clean up any remaining intervals
    for (const interval of intervals) {
      originalClearInterval(interval);
    }
    intervals.clear();
  });

  describe("getMetrics", () => {
    it("should return system metrics with valid structure", async () => {
      // Uncomment when implementation is ready
      // const metrics = await provider.getMetrics();
      // expect(metrics).to.not.be.undefined;
      // expect(metrics).to.not.be.null;
      // if (metrics) {
      //   // CPU metrics
      //   expect(metrics.cpu.percent).to.be.at.least(0);
      //   expect(metrics.cpu.percent).to.be.at.most(100);
      //   // Memory metrics
      //   expect(metrics.memory.used).to.be.greaterThan(0);
      //   expect(metrics.memory.total).to.be.greaterThan(0);
      //   expect(metrics.memory.percent).to.be.at.least(0);
      //   expect(metrics.memory.percent).to.be.at.most(100);
      //   // Disk metrics
      //   expect(metrics.disk.used).to.be.at.least(0);
      //   expect(metrics.disk.total).to.be.greaterThan(0);
      //   expect(metrics.disk.percent).to.be.at.least(0);
      //   expect(metrics.disk.percent).to.be.at.most(100);
      //   // Network metrics
      //   expect(metrics.network.rxSec).to.be.at.least(0);
      //   expect(metrics.network.txSec).to.be.at.least(0);
      // }
    });

    it("should handle concurrent getMetrics calls", async () => {
      // Uncomment when implementation is ready
      // Test that multiple simultaneous calls don't interfere
      // const [metrics1, metrics2, metrics3] = await Promise.all([
      //   provider.getMetrics(),
      //   provider.getMetrics(),
      //   provider.getMetrics(),
      // ]);
      // expect(metrics1).to.not.be.null;
      // expect(metrics2).to.not.be.null;
      // expect(metrics3).to.not.be.null;
      // // All should have valid structure
      // if (metrics1 && metrics2 && metrics3) {
      //   expect(metrics1.cpu.percent).to.be.within(0, 100);
      //   expect(metrics2.cpu.percent).to.be.within(0, 100);
      //   expect(metrics3.cpu.percent).to.be.within(0, 100);
      // }
    });
  });

  describe("startUpdate/stopUpdate", () => {
    it("should call callback periodically", async () => {
      // Uncomment when implementation is ready
      // let callCount = 0;
      // let lastMetrics: SysmonRenderData | null = null;
      // provider.startUpdate(100, (metrics) => {
      //   callCount++;
      //   lastMetrics = metrics;
      // });
      // // Wait for ~350ms, should get ~3-4 callbacks
      // await new Promise((resolve) => setTimeout(resolve, 350));
      // provider.stopUpdate();
      // expect(callCount).to.be.at.least(2);
      // expect(lastMetrics).to.not.be.undefined;
    });

    it("should stop calling callback after stopUpdate", async () => {
      // Uncomment when implementation is ready
      // let callCount = 0;
      // provider.startUpdate(50, () => {
      //   callCount++;
      // });
      // await new Promise((resolve) => setTimeout(resolve, 150));
      // provider.stopUpdate();
      // const countAtStop = callCount;
      // // Wait another 150ms
      // await new Promise((resolve) => setTimeout(resolve, 150));
      // // Count should not have increased
      // expect(callCount).to.equal(countAtStop);
    });

    it("should handle multiple startUpdate calls", async () => {
      // Uncomment when implementation is ready
      // let callCount = 0;
      // // First start
      // provider.startUpdate(100, () => {
      //   callCount++;
      // });
      // await new Promise((resolve) => setTimeout(resolve, 150));
      // // Second start should replace first
      // provider.startUpdate(50, () => {
      //   callCount++;
      // });
      // await new Promise((resolve) => setTimeout(resolve, 100));
      // provider.stopUpdate();
      // // Should have received callbacks from both periods
      // expect(callCount).to.be.at.least(2);
    });

    it("should handle stopUpdate without startUpdate gracefully", () => {
      // Uncomment when implementation is ready
      // // Should not throw when stopping without starting
      // expect(() => {
      //   provider.stopUpdate();
      //   provider.stopUpdate(); // Multiple stops
      // }).to.not.throw();
    });

    it("should cleanup interval on stopUpdate", () => {
      // Uncomment when implementation is ready
      // let capturedIntervalId: NodeJS.Timeout | undefined;
      // provider.startUpdate(100, () => {});
      // // Capture the interval ID from the mock
      // const setIntervalMock = global.setInterval as unknown as { mock: { calls: unknown[][] } };
      // if (setIntervalMock.mock?.calls?.length > 0) {
      //   const call = setIntervalMock.mock.calls[0];
      //   capturedIntervalId = call[0] as NodeJS.Timeout;
      // }
      // expect(intervals.size).to.be.greaterThan(0);
      // provider.stopUpdate();
      // // Verify clearInterval was called
      // const clearIntervalMock = global.clearInterval as unknown as { mock: { calls: unknown[][] } };
      // expect(clearIntervalMock.mock?.calls?.length).to.be.greaterThan(0);
      // expect(intervals.size).to.equal(0);
    });
  });

  describe("edge cases", () => {
    it("should handle very short update intervals", async () => {
      // Uncomment when implementation is ready
      // let callCount = 0;
      // // Use a very short interval (10ms)
      // provider.startUpdate(10, () => {
      //   callCount++;
      //   if (callCount >= 5) {
      //     provider.stopUpdate();
      //   }
      // });
      // await new Promise((resolve) => setTimeout(resolve, 100));
      // expect(callCount).to.be.at.least(5);
    });

    it("should handle zero interval gracefully", () => {
      // Uncomment when implementation is ready
      // // Should not throw on zero interval (will use browser/setInterval minimum)
      // expect(() => {
      //   provider.startUpdate(0, () => {});
      //   provider.stopUpdate();
      // }).to.not.throw();
    });

    it("should handle negative interval gracefully", () => {
      // Uncomment when implementation is ready
      // // Should not throw on negative interval
      // expect(() => {
      //   provider.startUpdate(-100, () => {});
      //   provider.stopUpdate();
      // }).to.not.throw();
    });

    it("should handle callback that throws exception", async () => {
      // Uncomment when implementation is ready
      // let errorCount = 0;
      // provider.startUpdate(50, () => {
      //   errorCount++;
      //   throw new Error("Test error in callback");
      // });
      // // Wait a bit
      // await new Promise((resolve) => setTimeout(resolve, 150));
      // // Provider should continue despite callback errors
      // provider.stopUpdate();
      // expect(errorCount).to.be.at.least(1);
    });
  });

  describe("cleanup verification", () => {
    it("should cleanup all resources on stopUpdate", async () => {
      // Uncomment when implementation is ready
      // let callbackInvoked = false;
      // provider.startUpdate(100, () => {
      //   callbackInvoked = true;
      // });
      // await new Promise((resolve) => setTimeout(resolve, 50));
      // provider.stopUpdate();
      // const clearIntervalMock = global.clearInterval as unknown as { mock: { calls: unknown[][] } };
      // const clearIntervalCalls = clearIntervalMock.mock?.calls?.length || 0;
      // // Verify clearInterval was called at least once
      // expect(clearIntervalCalls).to.be.greaterThan(0);
      // expect(intervals.size).to.equal(0);
    });

    it("should handle rapid start/stop cycles", async () => {
      // Uncomment when implementation is ready
      // // Test rapid start/stop doesn't leak intervals
      // for (let i = 0; i < 10; i++) {
      //   provider.startUpdate(50, () => {});
      //   await new Promise((resolve) => setTimeout(resolve, 5));
      //   provider.stopUpdate();
      // }
      // // All intervals should be cleaned up
      // expect(intervals.size).to.equal(0);
    });
  });
});
