import { success, failure } from "./result.js";
export function object(shape) {
    return {
        validate(value) {
            if (typeof value !== "object" || value === null || Array.isArray(value)) {
                return failure([], "Expected object", value);
            }
            const result = {};
            for (const [key, validator] of Object.entries(shape)) {
                const fieldValue = value[key];
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
export function optional(validator) {
    return {
        validate(value) {
            if (value === undefined)
                return success(undefined);
            return validator.validate(value);
        },
    };
}
export function nullable(validator) {
    return {
        validate(value) {
            if (value === null)
                return success(null);
            return validator.validate(value);
        },
    };
}
export function partial(shape) {
    const optionalShape = {};
    for (const [key, validator] of Object.entries(shape)) {
        optionalShape[key] = optional(validator);
    }
    return object(optionalShape);
}
//# sourceMappingURL=combinators.js.map