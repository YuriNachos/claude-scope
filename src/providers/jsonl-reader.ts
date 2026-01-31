/**
 * JSONL Reader Utility
 *
 * Provides shared functionality for reading JSONL (JSON Lines) files
 * with proper resource cleanup and error handling.
 */

import { createReadStream, existsSync } from "node:fs";
import { createInterface } from "node:readline";

export interface JsonlReaderOptions {
  encoding?: BufferEncoding;
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
