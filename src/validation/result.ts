import type { ValidationResult, ValidationError } from './core.js';

export function success<T>(data: T): ValidationResult<T> {
  return { success: true, data };
}

export function failure(path: string[], message: string, value: unknown): ValidationResult<never> {
  return { success: false, error: { path, message, value } };
}

export function formatError(error: ValidationError): string {
  const path = error.path.length > 0 ? error.path.join('.') : 'root';
  return `${path}: ${error.message}`;
}
