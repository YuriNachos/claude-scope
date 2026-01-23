/**
 * UsageParser - Extracts context usage data from Claude Code transcript files
 *
 * This parser reads JSONL transcript files to find the last assistant message
 * with usage data. This is useful as a fallback when current_usage is null
 * (during tool execution or in new sessions).
 */

import { createReadStream, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import type { ContextUsage } from "../schemas/stdin-schema.js";
import type { TranscriptLine, TranscriptUsage } from "./usage-types.js";

/**
 * Parses Claude Code transcript files to extract usage data
 */
export class UsageParser {
  /**
   * Parse the last assistant message with usage data from transcript
   * Reads file in reverse to find the most recent data quickly
   *
   * @param transcriptPath - Path to the JSONL transcript file
   * @returns ContextUsage or null if not found
   */
  parseLastUsage(transcriptPath: string): ContextUsage | null {
    // Fast fail if file doesn't exist
    if (!existsSync(transcriptPath)) {
      return null;
    }

    try {
      // Read all lines into memory (transcripts are typically small)
      const lines = this.readAllLines(transcriptPath);

      // Iterate in reverse to find the last assistant message with usage
      for (let i = lines.length - 1; i >= 0; i--) {
        const usage = this.parseLineForUsage(lines[i]);
        if (usage) {
          return usage;
        }
      }

      // No assistant message with usage found
      return null;
    } catch {
      // Any error (read, parse, etc.) returns null
      // Let the fallback chain handle it
      return null;
    }
  }

  /**
   * Read all lines from transcript file
   */
  private readAllLines(transcriptPath: string): string[] {
    const lines: string[] = [];

    try {
      const fileStream = createReadStream(transcriptPath, { encoding: "utf-8" });
      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (line.trim()) {
          lines.push(line);
        }
      }
    } catch {
      // Return empty array on read error
      return [];
    }

    return lines;
  }

  /**
   * Parse a single transcript line for usage data
   * Returns null if line is not an assistant message with usage
   */
  private parseLineForUsage(line: string): ContextUsage | null {
    try {
      const entry = JSON.parse(line) as TranscriptLine;

      // Must be assistant message with usage data
      if (entry.type !== "assistant") {
        return null;
      }

      const usage = entry.message?.usage;
      if (!usage) {
        return null;
      }

      // Validate required fields exist
      if (
        typeof usage.input_tokens !== "number" ||
        typeof usage.output_tokens !== "number" ||
        typeof usage.cache_read_input_tokens !== "number"
      ) {
        return null;
      }

      // Build ContextUsage with defaults for optional fields
      return {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: usage.cache_read_input_tokens,
      };
    } catch {
      // Invalid JSON or unexpected structure
      return null;
    }
  }
}
