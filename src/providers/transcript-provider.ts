import { createReadStream, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import type { ToolEntry } from "./transcript-types.js";

/**
 * JSONL transcript line structure
 */
interface TranscriptLine {
  message?: {
    content?: Array<{
      type: string;
      id?: string;
      name?: string;
      tool_use_id?: string;
      is_error?: boolean;
      input?: Record<string, unknown>;
    }>;
  };
}

/**
 * Interface for transcript parsing
 */
export interface ITranscriptProvider {
  parseTools(path: string): Promise<ToolEntry[]>;
}

/**
 * Parses Claude Code transcript files to track tool usage
 * Matches tool_use blocks with tool_result blocks by ID
 */
export class TranscriptProvider implements ITranscriptProvider {
  private readonly MAX_TOOLS = 20;

  /**
   * Parse tools from a JSONL transcript file
   * @param transcriptPath Path to the transcript file
   * @returns Array of tool entries, limited to last 20
   */
  async parseTools(transcriptPath: string): Promise<ToolEntry[]> {
    if (!existsSync(transcriptPath)) {
      return [];
    }

    const toolMap = new Map<string, ToolEntry>();

    try {
      const fileStream = createReadStream(transcriptPath, { encoding: "utf-8" });
      const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (!line.trim()) continue;

        try {
          const entry = JSON.parse(line) as TranscriptLine;
          this.processLine(entry, toolMap);
        } catch {}
      }

      // Convert to array and limit to last 20 tools
      const tools = Array.from(toolMap.values());
      return tools.slice(-this.MAX_TOOLS);
    } catch {
      return [];
    }
  }

  /**
   * Process a single transcript line and update tool map
   */
  private processLine(line: TranscriptLine, toolMap: Map<string, ToolEntry>): void {
    const blocks = line.message?.content ?? [];
    const timestamp = new Date();

    for (const block of blocks) {
      // Handle tool_use blocks - create new tool entries
      if (block.type === "tool_use" && block.id && block.name) {
        const tool: ToolEntry = {
          id: block.id,
          name: block.name,
          target: this.extractTarget(block.name, block.input),
          status: "running",
          startTime: timestamp,
        };
        toolMap.set(block.id, tool);
      }

      // Handle tool_result blocks - update tool status
      if (block.type === "tool_result" && block.tool_use_id) {
        const existing = toolMap.get(block.tool_use_id);
        if (existing) {
          existing.status = block.is_error ? "error" : "completed";
          existing.endTime = timestamp;
        }
      }
    }
  }

  /**
   * Extract target from tool input based on tool type
   */
  private extractTarget(toolName: string, input?: Record<string, unknown>): string | undefined {
    if (!input) return undefined;

    switch (toolName) {
      case "Read":
      case "Write":
      case "Edit":
        return this.asString(input.file_path ?? input.path);
      case "Glob":
        return this.asString(input.pattern);
      case "Grep":
        return this.asString(input.pattern);
      case "Bash": {
        const cmd = this.asString(input.command);
        return cmd ? this.truncateCommand(cmd) : undefined;
      }
      default:
        return undefined;
    }
  }

  /**
   * Safely convert value to string
   */
  private asString(value: unknown): string | undefined {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return undefined;
  }

  /**
   * Truncate long commands to 30 chars
   */
  private truncateCommand(cmd: string): string {
    if (cmd.length <= 30) return cmd;
    return `${cmd.slice(0, 30)}...`;
  }
}
