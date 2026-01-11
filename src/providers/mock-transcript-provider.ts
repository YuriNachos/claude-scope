/**
 * Mock Transcript provider for testing and preview mode
 * Returns realistic demo tool data without accessing actual transcript files
 */

import type { ITranscriptProvider } from "./transcript-provider.js";
import type { ToolEntry } from "./transcript-types.js";

/**
 * Mock Transcript provider with hardcoded demo data
 *
 * Demo data represents typical Claude Code session:
 * - Mix of Read, Edit, Bash tools
 * - Some tools running, some completed
 * - Realistic targets (file paths, commands)
 */
export class MockTranscriptProvider implements ITranscriptProvider {
  /**
   * Return demo tool entries
   * @param path - Transcript path (ignored in mock)
   * @returns Array of demo tool entries
   */
  async parseTools(_path: string): Promise<ToolEntry[]> {
    const now = new Date();
    const minuteAgo = new Date(now.getTime() - 60 * 1000);

    return [
      {
        id: "tool_1",
        name: "Read",
        target: "src/config.ts",
        status: "completed",
        startTime: minuteAgo,
        endTime: minuteAgo,
      },
      {
        id: "tool_2",
        name: "Edit",
        target: "src/config.ts",
        status: "completed",
        startTime: minuteAgo,
        endTime: minuteAgo,
      },
      {
        id: "tool_3",
        name: "Read",
        target: "src/widget.ts",
        status: "completed",
        startTime: minuteAgo,
        endTime: minuteAgo,
      },
      {
        id: "tool_4",
        name: "Bash",
        target: "npm test",
        status: "running",
        startTime: now,
      },
      {
        id: "tool_5",
        name: "Edit",
        target: "src/styles.ts",
        status: "completed",
        startTime: minuteAgo,
        endTime: minuteAgo,
      },
    ];
  }
}
