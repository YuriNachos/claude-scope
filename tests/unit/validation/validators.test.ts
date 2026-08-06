import assert from "node:assert";
import { describe, it } from "node:test";
import { oneOf } from "../../../src/validation/validators.js";

describe("oneOf", () => {
  const validator = oneOf(["a", "b", "c"] as const);

  it("accepts a value from the allowed list", () => {
    const result = validator.validate("b");

    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data, "b");
    }
  });

  it("rejects a value outside the allowed list, naming every allowed value in the message", () => {
    const result = validator.validate("z");

    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.message, "Expected one of: a, b, c");
    }
  });

  it("rejects a non-string value", () => {
    const result = validator.validate(42);

    assert.strictEqual(result.success, false);
  });
});
