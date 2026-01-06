import type { Validator } from './core.js';
export declare function string(): Validator<string>;
export declare function number(): Validator<number>;
export declare function literal<T extends string | number | boolean>(expected: T): Validator<T>;
export declare function nullValidator(): Validator<null>;
export declare function unknown(): Validator<unknown>;
//# sourceMappingURL=validators.d.ts.map