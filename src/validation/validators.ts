import type { Validator } from "./core.js";
import { failure, success } from "./result.js";

export function string(): Validator<string> {
  return {
    validate(value) {
      if (typeof value === "string") return success(value);
      return failure([], "Expected string", value);
    },
  };
}

export function number(): Validator<number> {
  return {
    validate(value) {
      if (typeof value === "number" && !Number.isNaN(value)) return success(value);
      return failure([], "Expected number", value);
    },
  };
}

export function literal<T extends string | number | boolean>(expected: T): Validator<T> {
  return {
    validate(value) {
      if (value === expected) return success(expected);
      return failure([], `Expected '${expected}'`, value);
    },
  };
}

/**
 * Accept only one of a fixed set of string values
 *
 * @param values - Allowed values; the returned validator narrows to their union
 */
export function oneOf<T extends string>(values: readonly T[]): Validator<T> {
  return {
    validate(value) {
      if (typeof value === "string" && (values as readonly string[]).includes(value)) {
        return success(value as T);
      }
      return failure([], `Expected one of: ${values.join(", ")}`, value);
    },
  };
}
