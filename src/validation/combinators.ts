import type { InferValidator, Validator } from "./core.js";
import { failure, success } from "./result.js";

export function object<T extends Record<string, Validator<any>>>(
  shape: T
): Validator<{ [K in keyof T]: InferValidator<T[K]> }> {
  return {
    validate(value) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return failure([], "Expected object", value);
      }

      const result = {} as any;
      for (const [key, validator] of Object.entries(shape)) {
        const fieldValue = (value as any)[key];
        const validationResult = validator.validate(fieldValue);
        if (!validationResult.success) {
          return {
            success: false,
            error: { ...validationResult.error, path: [key, ...validationResult.error.path] },
          };
        }
        result[key] = validationResult.data;
      }
      return success(result);
    },
  };
}

export function optional<T>(validator: Validator<T>): Validator<T | undefined> {
  return {
    validate(value) {
      if (value === undefined) return success(undefined);
      return validator.validate(value);
    },
  };
}

export function nullable<T>(validator: Validator<T>): Validator<T | null> {
  return {
    validate(value) {
      if (value === null) return success(null);
      return validator.validate(value);
    },
  };
}
