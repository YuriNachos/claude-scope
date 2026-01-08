import type { Validator, InferValidator } from "./core.js";
export declare function object<T extends Record<string, Validator<any>>>(shape: T): Validator<{
    [K in keyof T]: InferValidator<T[K]>;
}>;
export declare function optional<T>(validator: Validator<T>): Validator<T | undefined>;
export declare function nullable<T>(validator: Validator<T>): Validator<T | null>;
export declare function partial<T extends Record<string, Validator<any>>>(shape: T): Validator<Partial<{
    [K in keyof T]: InferValidator<T[K]>;
}>>;
//# sourceMappingURL=combinators.d.ts.map