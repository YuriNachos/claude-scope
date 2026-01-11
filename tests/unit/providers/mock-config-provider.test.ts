/**
 * MockConfigProvider Unit Tests
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { MockConfigProvider } from "../../../src/providers/mock-config-provider.js";

describe("MockConfigProvider", () => {
  it("should return demo config counts", async () => {
    const provider = new MockConfigProvider();
    const configs = await provider.getConfigs();

    assert.strictEqual(configs.claudeMdCount, 1);
    assert.strictEqual(configs.rulesCount, 3);
    assert.strictEqual(configs.mcpCount, 2);
    assert.strictEqual(configs.hooksCount, 4);
  });

  it("should have non-zero counts for all categories", async () => {
    const provider = new MockConfigProvider();
    const configs = await provider.getConfigs();

    assert.ok(configs.claudeMdCount > 0, "CLAUDE.md count should be > 0");
    assert.ok(configs.rulesCount > 0, "rules count should be > 0");
    assert.ok(configs.mcpCount > 0, "MCP count should be > 0");
    assert.ok(configs.hooksCount > 0, "hooks count should be > 0");
  });

  it("should return consistent data on multiple calls", async () => {
    const provider = new MockConfigProvider();
    const configs1 = await provider.getConfigs();
    const configs2 = await provider.getConfigs();

    assert.deepStrictEqual(configs1, configs2);
  });

  it("should represent realistic project configuration", async () => {
    const provider = new MockConfigProvider();
    const configs = await provider.getConfigs();

    const total =
      configs.claudeMdCount + configs.rulesCount + configs.mcpCount + configs.hooksCount;

    assert.ok(total >= 5, "Total config count should be at least 5");
    assert.ok(total <= 20, "Total config count should be reasonable (≤20)");
  });
});
