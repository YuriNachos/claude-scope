/**
 * UsageParser - Extracts context usage data from Claude Code transcript files
 *
 * This parser reads JSONL transcript files to find the last assistant message
 * with usage data. This is useful as a fallback when current_usage is null
 * (during tool execution or in new sessions).
 */

// Use require for existsSync to ensure it works in bundled code
import { createReadStream, existsSync } from "fs";
import { createInterface } from "readline";
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
  async parseLastUsage(transcriptPath: string): Promise<ContextUsage | null> {
    // Fast fail if file doesn't exist
    if (!existsSync(transcriptPath)) {
      return null;
    }

    try {
      // Read all lines into memory (transcripts are typically small)
      const lines = await this.readAllLines(transcriptPath);

      // Find the MOST RECENT assistant message with usage data
      // Strategy:
      // 1. If timestamps are available, use the most recent by timestamp
      // 2. If no timestamps, use the last occurrence in the file (reverse iteration)
      let mostRecentUsage: ContextUsage | null = null;
      let mostRecentTimestamp: Date | null = null;
      let hasAnyTimestamp = false;

      for (const line of lines) {
        const entry = this.parseLineForUsage(line);
        if (entry) {
          const entryTime = this.parseTimestamp(line);
          if (entryTime) {
            // Has timestamp - use timestamp-based comparison
            hasAnyTimestamp = true;
            if (!mostRecentTimestamp || entryTime > mostRecentTimestamp) {
              mostRecentUsage = entry;
              mostRecentTimestamp = entryTime;
            }
          } else if (!hasAnyTimestamp) {
            // No timestamp yet - use this as fallback (will be overwritten if we find a timestamp)
            // Since we iterate forward, the last valid entry without timestamp will be kept
            mostRecentUsage = entry;
          }
        }
      }

      return mostRecentUsage;
    } catch {
      // Any error (read, parse, etc.) returns null
      // Let the fallback chain handle it
      return null;
    }
  }

  /**
   * Parse timestamp from a transcript line
   */
  private parseTimestamp(line: string): Date | null {
    try {
      const entry = JSON.parse(line);
      if (entry.timestamp) {
        return new Date(entry.timestamp);
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  /**
   * Read all lines from transcript file
   */
  private async readAllLines(transcriptPath: string): Promise<string[]> {
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
   * Parse cumulative cache tokens from all assistant messages in transcript
   *
   * Handles two transcript formats:
   * 1. Per-message format: cache_read varies per message (e.g., 2048, 4096) → sum all
   * 2. Cumulative format: cache_read is already cumulative (e.g., 165376) → use last
   *
   * @param transcriptPath - Path to the JSONL transcript file
   * @returns Object with cumulative cacheRead and cacheCreation, or null if not found
   */
  async parseCumulativeCache(
    transcriptPath: string
  ): Promise<{ cacheRead: number; cacheCreation: number } | null> {
    if (!existsSync(transcriptPath)) {
      return null;
    }

    try {
      const lines = await this.readAllLines(transcriptPath);

      // Collect all cache entries with timestamps
      const cacheEntries: { cacheRead: number; cacheCreation: number; timestamp: string }[] = [];

      for (const line of lines) {
        const entry = this.parseLineForCache(line);
        if (entry) {
          const timestamp = this.parseTimestamp(line);
          cacheEntries.push({
            cacheRead: entry.cacheRead,
            cacheCreation: entry.cacheCreation,
            timestamp: timestamp?.toISOString() || "",
          });
        }
      }

      if (cacheEntries.length === 0) {
        return null;
      }

      // Detect format: check if cache_read is monotonically increasing (cumulative format)
      // If values grow or stay same → cumulative, use last value
      // If values fluctuate → per-message, sum all
      let isCumulativeFormat = false;
      if (cacheEntries.length > 1) {
        let nonDecreasingCount = 0;
        for (let i = 1; i < cacheEntries.length; i++) {
          if (cacheEntries[i].cacheRead >= cacheEntries[i - 1].cacheRead) {
            nonDecreasingCount++;
          }
        }
        // If 80%+ are non-decreasing, assume cumulative format
        isCumulativeFormat = nonDecreasingCount / (cacheEntries.length - 1) >= 0.8;
      }

      let cumulativeCacheRead: number;
      let cumulativeCacheCreation: number;

      if (isCumulativeFormat) {
        // Cumulative format: use the last (most recent) value
        const lastEntry = cacheEntries[cacheEntries.length - 1];
        cumulativeCacheRead = lastEntry.cacheRead;
        cumulativeCacheCreation = lastEntry.cacheCreation;
      } else {
        // Per-message format: sum all values
        cumulativeCacheRead = cacheEntries.reduce((sum, e) => sum + e.cacheRead, 0);
        cumulativeCacheCreation = cacheEntries.reduce((sum, e) => sum + e.cacheCreation, 0);
      }

      // Return null if no cache data found at all
      if (cumulativeCacheRead === 0 && cumulativeCacheCreation === 0) {
        return null;
      }

      return {
        cacheRead: cumulativeCacheRead,
        cacheCreation: cumulativeCacheCreation,
      };
    } catch {
      return null;
    }
  }

  /**
   * Parse a single transcript line for cache data
   * Returns null if line is not an assistant message with usage
   */
  private parseLineForCache(line: string): { cacheRead: number; cacheCreation: number } | null {
    try {
      const entry = JSON.parse(line) as TranscriptLine;

      if (entry.type !== "assistant") {
        return null;
      }

      const usage = entry.message?.usage;
      if (!usage) {
        return null;
      }

      // cache_read_input_tokens and cache_creation_input_tokens are optional
      const cacheRead = usage.cache_read_input_tokens ?? 0;
      const cacheCreation = usage.cache_creation_input_tokens ?? 0;

      // Return null if no cache data in this message
      if (cacheRead === 0 && cacheCreation === 0) {
        return null;
      }

      return { cacheRead, cacheCreation };
    } catch {
      return null;
    }
  }

  /**
   * Parse a single transcript line for usage data
   * Returns null if line is not an assistant message with usage
   *
   * Follows ccstatusline approach: skip sidechain and API error messages
   */
  private parseLineForUsage(line: string): ContextUsage | null {
    try {
      const entry = JSON.parse(line) as TranscriptLine;

      // Must be assistant message with usage data
      if (entry.type !== "assistant") {
        return null;
      }

      // ccstatusline: skip sidechain messages (system/tool messages)
      if (entry.isSidechain === true) {
        return null;
      }

      // ccstatusline: skip API error messages (synthetic 0-token messages)
      if (entry.isApiErrorMessage === true) {
        return null;
      }

      const usage = entry.message?.usage;
      if (!usage) {
        return null;
      }

      // Validate required fields: input_tokens and output_tokens must exist
      // cache_read_input_tokens is optional (may not be present in all messages)
      if (typeof usage.input_tokens !== "number" || typeof usage.output_tokens !== "number") {
        return null;
      }

      // Build ContextUsage with defaults for optional fields
      return {
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_creation_input_tokens: usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: usage.cache_read_input_tokens ?? 0, // Default to 0 if missing
      };
    } catch {
      // Invalid JSON or unexpected structure
      return null;
    }
  }
}
