/**
 * Unit tests for MetricsCache
 */

import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { MetricsCache } from "../../../src/providers/metrics-cache.js";
import type { SysmonRenderData } from "../../../src/widgets/sysmon/types.js";

describe("MetricsCache", () => {
  it("should return cached value within TTL", async () => {
    const cache = new MetricsCache(1000); // 1s TTL
    const mockData: SysmonRenderData = {
      cpu: { percent: 50 },
      memory: { used: 8, total: 16, percent: 50 },
      disk: { used: 100, total: 200, percent: 50 },
      network: { rxSec: 1, txSec: 0.5 },
    };

    // First call
    const fetcher = async () => mockData;
    const result1 = await cache.get(fetcher);
    assert.strictEqual(result1.cpu.percent, 50);

    // Second call within TTL - should return cached
    const result2 = await cache.get(fetcher);
    assert.strictEqual(result2, result1); // Same reference
  });

  it("should fetch fresh value after TTL expires", async () => {
    const cache = new MetricsCache(100); // 100ms TTL
    const mockData: SysmonRenderData = {
      cpu: { percent: 50 },
      memory: { used: 8, total: 16, percent: 50 },
      disk: { used: 100, total: 200, percent: 50 },
      network: { rxSec: 1, txSec: 0.5 },
    };

    let callCount = 0;
    const fetcher = async () => {
      callCount++;
      return mockData;
    };

    // First call
    await cache.get(fetcher);
    assert.strictEqual(callCount, 1);

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Second call - should fetch again
    await cache.get(fetcher);
    assert.strictEqual(callCount, 2);
  });

  it("should return null when fetcher returns null", async () => {
    const cache = new MetricsCache(1000);
    const result = await cache.get(async () => null);
    assert.strictEqual(result, null);
  });
});
