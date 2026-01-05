/**
 * Stdin provider for parsing JSON data from stdin
 * Parses and validates Claude Code session data
 */

import type { StdinData } from '../types.js';

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
 * Stdin provider for parsing JSON data
 */
export class StdinProvider {
  /**
   * Parse JSON string from stdin
   * @param input JSON string to parse
   * @returns Parsed StdinData object
   * @throws StdinParseError if JSON is malformed
   * @throws StdinValidationError if data is invalid
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
      throw new StdinParseError('Failed to parse stdin data: Invalid JSON');
    }

    // Validate data structure
    if (!this.validate(data)) {
      throw new StdinValidationError('stdin data validation failed: missing required fields');
    }

    return data as StdinData;
  }

  /**
   * Validate stdin data structure
   * @param data Data to validate
   * @returns true if valid, false otherwise
   */
  validate(data: unknown): data is StdinData {
    // Basic type check
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    const obj = data as Record<string, unknown>;

    // Check required top-level fields
    if (typeof obj.session_id !== 'string') {
      return false;
    }

    if (typeof obj.cwd !== 'string') {
      return false;
    }

    // Check model object
    if (typeof obj.model !== 'object' || obj.model === null) {
      return false;
    }

    const model = obj.model as Record<string, unknown>;

    if (typeof model.id !== 'string') {
      return false;
    }

    if (typeof model.display_name !== 'string') {
      return false;
    }

    return true;
  }
}
