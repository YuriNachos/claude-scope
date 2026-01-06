/**
 * Stdin provider for parsing JSON data from stdin
 * Parses and validates Claude Code session data using Zod
 */

import { z } from 'zod';
import type { StdinData } from '../types.js';
import { StdinDataSchema } from '../schemas/stdin-schema.js';

/**
 * Error thrown when stdin parsing fails
 */
export class StdinParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StdinParseError';
  }
}

/**
 * Error thrown when stdin validation fails
 */
export class StdinValidationError extends Error {
  constructor(message: string) {
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
  async parse(input: string): Promise<StdinData> {
    // Check for empty input
    if (!input || input.trim().length === 0) {
      throw new StdinParseError('stdin data is empty');
    }

    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(input);
    } catch (error) {
      throw new StdinParseError(`Invalid JSON: ${(error as Error).message}`);
    }

    // Validate with Zod
    try {
      return StdinDataSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format error messages nicely
        const errorDetails = error.errors
          .map(e => {
            const path = e.path.length > 0 ? e.path.join('.') : 'root';
            return `${path}: ${e.message}`;
          })
          .join(', ');

        throw new StdinValidationError(
          `Validation failed: ${errorDetails}`
        );
      }
      throw error;
    }
  }

  /**
   * Safe parse that returns result instead of throwing
   * Useful for testing and optional validation
   * @param input JSON string to parse
   * @returns Result object with success flag
   */
  safeParse(input: string): { success: true; data: StdinData } | { success: false; error: string } {
    try {
      const data = this.parse(input);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
