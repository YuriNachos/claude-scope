/**
 * Tool lifecycle entry from transcript parsing
 */
export interface ToolEntry {
    /** Unique tool identifier from tool_use block */
    id: string;
    /** Tool name (Read, Edit, Bash, etc.) */
    name: string;
    /** Extracted target (file path, pattern, command snippet) */
    target?: string;
    /** Current tool status */
    status: "running" | "completed" | "error";
    /** When tool was invoked */
    startTime: Date;
    /** When tool completed (if applicable) */
    endTime?: Date;
}
//# sourceMappingURL=transcript-types.d.ts.map