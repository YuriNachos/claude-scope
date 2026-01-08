import type { Validator } from "./core.js";
import { success, failure } from "./result.js";

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

export function nullValidator(): Validator<null> {
  return {
    validate(value) {
      if (value === null) return success(null);
      return failure([], "Expected null", value);
    },
  };
}

export function unknown(): Validator<unknown> {
  return {
    validate(value) {
      return success(value);
    },
  };
}
