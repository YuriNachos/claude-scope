import type { ValidationResult, ValidationError } from "./core.js";
export declare function success<T>(data: T): ValidationResult<T>;
export declare function failure(path: string[], message: string, value: unknown): ValidationResult<never>;
export declare function formatError(error: ValidationError): string;
//# sourceMappingURL=result.d.ts.map