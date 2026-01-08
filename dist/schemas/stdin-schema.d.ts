/**
 * Runtime type-safe schema for Claude Code stdin data
 * Custom validation system (no external dependencies)
 */
import type { InferValidator } from "../validation/core.js";
export declare const ContextUsageSchema: import("../validation/core.js").Validator<{
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
}>;
export declare const CostInfoSchema: import("../validation/core.js").Validator<{
    total_cost_usd: number | undefined;
    total_duration_ms: number | undefined;
    total_api_duration_ms: number | undefined;
    total_lines_added: number | undefined;
    total_lines_removed: number | undefined;
}>;
export declare const ContextWindowSchema: import("../validation/core.js").Validator<{
    total_input_tokens: number;
    total_output_tokens: number;
    context_window_size: number;
    current_usage: {
        input_tokens: number;
        output_tokens: number;
        cache_creation_input_tokens: number;
        cache_read_input_tokens: number;
    } | null;
}>;
export declare const ModelInfoSchema: import("../validation/core.js").Validator<{
    id: string;
    display_name: string;
}>;
export declare const WorkspaceSchema: import("../validation/core.js").Validator<{
    current_dir: string;
    project_dir: string;
}>;
export declare const OutputStyleSchema: import("../validation/core.js").Validator<{
    name: string;
}>;
export declare const StdinDataSchema: import("../validation/core.js").Validator<{
    hook_event_name: "Status" | undefined;
    session_id: string;
    transcript_path: string;
    cwd: string;
    model: {
        id: string;
        display_name: string;
    };
    workspace: {
        current_dir: string;
        project_dir: string;
    };
    version: string;
    output_style: {
        name: string;
    };
    cost: {
        total_cost_usd: number | undefined;
        total_duration_ms: number | undefined;
        total_api_duration_ms: number | undefined;
        total_lines_added: number | undefined;
        total_lines_removed: number | undefined;
    } | undefined;
    context_window: {
        total_input_tokens: number;
        total_output_tokens: number;
        context_window_size: number;
        current_usage: {
            input_tokens: number;
            output_tokens: number;
            cache_creation_input_tokens: number;
            cache_read_input_tokens: number;
        } | null;
    };
}>;
export type StdinData = InferValidator<typeof StdinDataSchema>;
export type ContextUsage = InferValidator<typeof ContextUsageSchema>;
export type CostInfo = InferValidator<typeof CostInfoSchema>;
export type ContextWindow = InferValidator<typeof ContextWindowSchema>;
export type ModelInfo = InferValidator<typeof ModelInfoSchema>;
export type Workspace = InferValidator<typeof WorkspaceSchema>;
export type OutputStyle = InferValidator<typeof OutputStyleSchema>;
//# sourceMappingURL=stdin-schema.d.ts.map