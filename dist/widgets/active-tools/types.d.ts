/**
 * Active tools widget types
 */
import type { ToolEntry } from "../../providers/transcript-types.js";
/**
 * Render data for active tools display
 */
export interface ActiveToolsRenderData {
    /** Currently running tools */
    running: ToolEntry[];
    /** Completed tools (aggregated by name with counts) */
    completed: Map<string, number>;
    /** Tools with errors */
    errors: ToolEntry[];
}
/**
 * Display style for active tools widget
 */
export type ActiveToolsStyle = "balanced" | "compact" | "minimal" | "playful" | "verbose" | "labeled" | "indicator";
//# sourceMappingURL=types.d.ts.map