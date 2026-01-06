/**
 * Stdin provider for parsing JSON data from stdin
 * Parses and validates Claude Code session data
 */
import { StdinDataSchema } from '../schemas/stdin-schema.js';
import { formatError } from '../validation/result.js';
/**
 * Error thrown when stdin parsing fails
 */
export class StdinParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StdinParseError';
    }
}
/**
 * Error thrown when stdin validation fails
 */
export class StdinValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StdinValidationError';
    }
}
/**
 * Stdin provider for parsing and validating JSON data
 */
export class StdinProvider {
    /**
     * Parse and validate JSON string from stdin
     * @param input JSON string to parse
     * @returns Validated StdinData object
     * @throws StdinParseError if JSON is malformed
     * @throws StdinValidationError if data doesn't match schema
     */
    async parse(input) {
        // Check for empty input
        if (!input || input.trim().length === 0) {
            throw new StdinParseError('stdin data is empty');
        }
        // Parse JSON
        let data;
        try {
            data = JSON.parse(input);
        }
        catch (error) {
            throw new StdinParseError(`Invalid JSON: ${error.message}`);
        }
        // Validate with schema
        const result = StdinDataSchema.validate(data);
        if (!result.success) {
            throw new StdinValidationError(`Validation failed: ${formatError(result.error)}`);
        }
        return result.data;
    }
    /**
     * Safe parse that returns result instead of throwing
     * Useful for testing and optional validation
     * @param input JSON string to parse
     * @returns Result object with success flag
     */
    async safeParse(input) {
        try {
            const data = await this.parse(input);
            return { success: true, data };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
//# sourceMappingURL=stdin-provider.js.map