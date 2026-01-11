import assert from "node:assert";
import { describe, it } from "node:test";
import { DEMO_DATA } from "../../src/constants.js";

describe("DEMO_DATA", () => {
  it("should show realistic context usage below 100%", () => {
    const totalCurrentTokens =
      DEMO_DATA.CURRENT_INPUT_TOKENS +
      DEMO_DATA.CURRENT_OUTPUT_TOKENS +
      DEMO_DATA.CACHE_CREATION_TOKENS +
      DEMO_DATA.CACHE_READ_TOKENS;

    const percentage = (totalCurrentTokens / DEMO_DATA.CONTEXT_WINDOW_SIZE) * 100;

    assert.ok(percentage < 100, `Context usage should be below 100%, got ${percentage}%`);
    assert.ok(percentage > 40, `Context usage should be realistic (>40%), got ${percentage}%`);
  });

  it("should show reasonable context usage for demo", () => {
    const totalCurrentTokens =
      DEMO_DATA.CURRENT_INPUT_TOKENS +
      DEMO_DATA.CURRENT_OUTPUT_TOKENS +
      DEMO_DATA.CACHE_CREATION_TOKENS +
      DEMO_DATA.CACHE_READ_TOKENS;

    const percentage = (totalCurrentTokens / DEMO_DATA.CONTEXT_WINDOW_SIZE) * 100;

    // Target: ~63% (medium range, shows yellow color)
    assert.ok(
      percentage >= 50 && percentage < 80,
      `Context usage should be in medium range (50-80%), got ${percentage}%`
    );
  });
});
