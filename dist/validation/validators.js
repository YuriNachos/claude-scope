import { failure, success } from "./result.js";
export function string() {
    return {
        validate(value) {
            if (typeof value === "string")
                return success(value);
            return failure([], "Expected string", value);
        },
    };
}
export function number() {
    return {
        validate(value) {
            if (typeof value === "number" && !Number.isNaN(value))
                return success(value);
            return failure([], "Expected number", value);
        },
    };
}
export function literal(expected) {
    return {
        validate(value) {
            if (value === expected)
                return success(expected);
            return failure([], `Expected '${expected}'`, value);
        },
    };
}
export function nullValidator() {
    return {
        validate(value) {
            if (value === null)
                return success(null);
            return failure([], "Expected null", value);
        },
    };
}
export function unknown() {
    return {
        validate(value) {
            return success(value);
        },
    };
}
//# sourceMappingURL=validators.js.map