/**
 * Stdin provider for parsing JSON data from stdin
 * Parses and validates Claude Code session data
 */
import type { StdinData } from '../types.js';
/**
 * Error thrown when stdin parsing fails
 */
export declare class StdinParseError extends Error {
    constructor(message: string);
}
/**
 * Error thrown when stdin validation fails
 */
export declare class StdinValidationError extends Error {
    constructor(message: string);
}
/**
 * Stdin provider for parsing JSON data
 */
export declare class StdinProvider {
    /**
     * Parse JSON string from stdin
     * @param input JSON string to parse
     * @returns Parsed StdinData object
     * @throws StdinParseError if JSON is malformed
     * @throws StdinValidationError if data is invalid
     */
    parse(input: string): Promise<StdinData>;
    /**
     * Validate stdin data structure
     * @param data Data to validate
     * @returns true if valid, false otherwise
     */
    validate(data: unknown): data is StdinData;
    /**
     * Validate stdin data and return detailed error message
     * @param data Data to validate
     * @returns Error message if invalid, null if valid
     */
    private getValidationError;
}
//# sourceMappingURL=stdin-provider.d.ts.map