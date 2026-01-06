/**
 * Result type for validation operations
 * Follows functional programming patterns (Either/Result monad)
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: ValidationError };

/**
 * Validation error with path information
 */
export interface ValidationError {
  path: string[];
  message: string;
  value: unknown;
}

/**
 * Base validator interface
 */
export interface Validator<T> {
  validate(value: unknown): ValidationResult<T>;
}

/**
 * Type inference helper
 */
export type InferValidator<V> = V extends Validator<infer T> ? T : never;
