import type { ToolEntry } from "./transcript-types.js";
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
export declare class TranscriptProvider implements ITranscriptProvider {
    private readonly MAX_TOOLS;
    /**
     * Parse tools from a JSONL transcript file
     * @param transcriptPath Path to the transcript file
     * @returns Array of tool entries, limited to last 20
     */
    parseTools(transcriptPath: string): Promise<ToolEntry[]>;
    /**
     * Process a single transcript line and update tool map
     */
    private processLine;
    /**
     * Extract target from tool input based on tool type
     */
    private extractTarget;
    /**
     * Safely convert value to string
     */
    private asString;
    /**
     * Truncate long commands to 30 chars
     */
    private truncateCommand;
}
//# sourceMappingURL=transcript-provider.d.ts.map