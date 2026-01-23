/**
 * Types for parsing usage data from Claude Code transcript files
 */

/**
 * Usage data from a single assistant message in the transcript
 * Matches the structure in Claude Code's JSONL format
 */
export interface TranscriptUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens?: number; // Optional - may not exist in older messages
}

/**
 * A single line in the JSONL transcript file
 */
export interface TranscriptLine {
  /** Message type: user, assistant, or summary */
  type?: "user" | "assistant" | "summary";
  /** Message content */
  message?: {
    /** Usage data from API response (only in assistant messages) */
    usage?: TranscriptUsage;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
