/**
 * JSONL Reader Utility
 *
 * Provides shared functionality for reading JSONL (JSON Lines) files
 * with proper resource cleanup and error handling.
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createInterface } from "node:readline";

export interface JsonlReaderOptions {
  encoding?: BufferEncoding;
}

/**
 * Tail window sizes tried, in order, before falling back to the whole file.
 *
 * Transcripts grow without bound while every consumer here only needs recent
 * entries, so reading the tail keeps the cost flat as a session gets longer.
 * A single transcript line can itself be megabytes (a large tool result), so
 * the first window is sized to hold many ordinary lines even if one huge line
 * lands in it, and the second covers the rare session of very large lines.
 */
export const TAIL_WINDOW_BYTES = [2 * 1024 * 1024, 16 * 1024 * 1024];

export interface JsonlTailResult {
  /** Lines in the window, oldest first. */
  lines: string[];
  /** True when the window covered the whole file, so `lines` is every line. */
  isWholeFile: boolean;
}

/**
 * Read and return all non-empty lines from a JSONL file
 * Properly handles resource cleanup in all scenarios
 *
 * @param filePath - Path to the JSONL file
 * @param options - Optional configuration
 * @returns Array of trimmed, non-empty lines
 */
export async function readJsonlLines(
  filePath: string,
  options: JsonlReaderOptions = {}
): Promise<string[]> {
  if (!existsSync(filePath)) {
    return [];
  }

  const lines: string[] = [];
  const fileStream = createReadStream(filePath, {
    encoding: options.encoding ?? "utf-8",
  });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  try {
    for await (const line of rl) {
      const trimmed = line.trim();
      if (trimmed) {
        lines.push(trimmed);
      }
    }
    return lines;
  } catch {
    return [];
  } finally {
    rl.close();
    fileStream.destroy();
  }
}

/**
 * Read the last `maxBytes` of a JSONL file
 *
 * The window starts at an arbitrary byte offset, so the first line it yields is
 * the tail of a record that began earlier in the file. That fragment is dropped:
 * every returned line is whole.
 *
 * @param filePath - Path to the JSONL file
 * @param maxBytes - Size of the tail window
 * @param options - Optional configuration
 * @returns The window's lines, and whether it covered the whole file
 */
export async function readJsonlTail(
  filePath: string,
  maxBytes: number,
  options: JsonlReaderOptions = {}
): Promise<JsonlTailResult> {
  if (!existsSync(filePath)) {
    return { lines: [], isWholeFile: true };
  }

  let size: number;
  try {
    size = statSync(filePath).size;
  } catch {
    return { lines: [], isWholeFile: true };
  }

  const start = Math.max(0, size - Math.max(0, maxBytes));
  if (start === 0) {
    return { lines: await readJsonlLines(filePath, options), isWholeFile: true };
  }

  const lines: string[] = [];
  const fileStream = createReadStream(filePath, {
    encoding: options.encoding ?? "utf-8",
    start,
  });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  try {
    let isFirstLine = true;
    for await (const line of rl) {
      if (isFirstLine) {
        // Partial record: `start` cut it, and it may also open mid-character.
        isFirstLine = false;
        continue;
      }
      const trimmed = line.trim();
      if (trimmed) {
        lines.push(trimmed);
      }
    }
    return { lines, isWholeFile: false };
  } catch {
    // Report the window as partial so the caller widens rather than trusting it
    return { lines: [], isWholeFile: false };
  } finally {
    rl.close();
    fileStream.destroy();
  }
}

/**
 * Answer a query from the smallest tail window that can answer it
 *
 * `scan` receives a window and returns the answer, or null to ask for a wider
 * one. It is called again with `isWholeFile` true once the window covers the
 * file, where it must answer with whatever it has. A `scan` that returns
 * non-null only when the window is self-sufficient therefore produces exactly
 * the result a whole-file read would, while usually reading a few MB.
 *
 * @param filePath - Path to the JSONL file
 * @param scan - Reads a window; returns the answer or null to widen
 * @param windows - Tail sizes to try, in ascending order
 * @returns The answer, or null if even the whole file has none
 */
export async function scanJsonlTail<T>(
  filePath: string,
  scan: (lines: string[], isWholeFile: boolean) => T | null,
  windows: readonly number[] = TAIL_WINDOW_BYTES
): Promise<T | null> {
  for (const window of windows) {
    const { lines, isWholeFile } = await readJsonlTail(filePath, window);
    if (isWholeFile) {
      return scan(lines, true);
    }
    const answer = scan(lines, false);
    if (answer !== null) {
      return answer;
    }
  }
  return scan(await readJsonlLines(filePath), true);
}

/**
 * Process JSONL file with per-line callback
 * Each line is parsed as JSON and passed to the processor function
 *
 * @param filePath - Path to the JSONL file
 * @param processor - Function to process each parsed line, returns result or null to skip
 * @returns Array of non-null results from processor
 */
export async function processJsonlFile<T>(
  filePath: string,
  processor: (parsed: unknown) => T | null
): Promise<T[]> {
  const lines = await readJsonlLines(filePath);
  const results: T[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      const result = processor(parsed);
      if (result !== null) {
        results.push(result);
      }
    } catch {
      // Skip malformed JSON lines
    }
  }

  return results;
}
