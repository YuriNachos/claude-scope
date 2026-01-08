/**
 * Stdin provider for parsing JSON data from stdin
 * Parses and validates Claude Code session data
 */
import type { StdinData } from "../types.js";
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
 * Stdin provider for parsing and validating JSON data
 */
export declare class StdinProvider {
    /**
     * Parse and validate JSON string from stdin
     * @param input JSON string to parse
     * @returns Validated StdinData object
     * @throws StdinParseError if JSON is malformed
     * @throws StdinValidationError if data doesn't match schema
     */
    parse(input: string): Promise<StdinData>;
    /**
     * Safe parse that returns result instead of throwing
     * Useful for testing and optional validation
     * @param input JSON string to parse
     * @returns Result object with success flag
     */
    safeParse(input: string): Promise<{
        success: true;
        data: StdinData;
    } | {
        success: false;
        error: string;
    }>;
}
//# sourceMappingURL=stdin-provider.d.ts.map