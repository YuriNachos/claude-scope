/**
 * Runtime type-safe schema for Claude Code stdin data
 *
 * This schema validates incoming JSON from Claude Code statusline API
 * and provides TypeScript types automatically via inference.
 */
import { z } from 'zod';
/**
 * Context usage schema
 * Details about current token usage in the context window
 */
export declare const ContextUsageSchema: z.ZodObject<{
    input_tokens: z.ZodNumber;
    output_tokens: z.ZodNumber;
    cache_creation_input_tokens: z.ZodNumber;
    cache_read_input_tokens: z.ZodNumber;
}, z.core.$strip>;
/**
 * Cost info schema
 * Details about session cost and duration
 */
export declare const CostInfoSchema: z.ZodObject<{
    total_cost_usd: z.ZodOptional<z.ZodNumber>;
    total_duration_ms: z.ZodOptional<z.ZodNumber>;
    total_api_duration_ms: z.ZodOptional<z.ZodNumber>;
    total_lines_added: z.ZodOptional<z.ZodNumber>;
    total_lines_removed: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Context window schema
 * Information about token usage and limits
 */
export declare const ContextWindowSchema: z.ZodObject<{
    total_input_tokens: z.ZodNumber;
    total_output_tokens: z.ZodNumber;
    context_window_size: z.ZodNumber;
    current_usage: z.ZodNullable<z.ZodObject<{
        input_tokens: z.ZodNumber;
        output_tokens: z.ZodNumber;
        cache_creation_input_tokens: z.ZodNumber;
        cache_read_input_tokens: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Model info schema
 * Information about the Claude model being used
 */
export declare const ModelInfoSchema: z.ZodObject<{
    id: z.ZodString;
    display_name: z.ZodString;
}, z.core.$strip>;
/**
 * Workspace schema
 * Information about current working directory
 */
export declare const WorkspaceSchema: z.ZodObject<{
    current_dir: z.ZodString;
    project_dir: z.ZodString;
}, z.core.$strip>;
/**
 * Output style schema
 * Information about current output style
 */
export declare const OutputStyleSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
/**
 * Main stdin data schema
 *
 * This is the primary schema for validating Claude Code statusline data.
 * All fields are validated at runtime, and TypeScript types are inferred
 * automatically.
 */
export declare const StdinDataSchema: z.ZodObject<{
    hook_event_name: z.ZodLiteral<"Status">;
    session_id: z.ZodString;
    transcript_path: z.ZodString;
    cwd: z.ZodString;
    model: z.ZodObject<{
        id: z.ZodString;
        display_name: z.ZodString;
    }, z.core.$strip>;
    workspace: z.ZodObject<{
        current_dir: z.ZodString;
        project_dir: z.ZodString;
    }, z.core.$strip>;
    version: z.ZodString;
    output_style: z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>;
    cost: z.ZodOptional<z.ZodObject<{
        total_cost_usd: z.ZodOptional<z.ZodNumber>;
        total_duration_ms: z.ZodOptional<z.ZodNumber>;
        total_api_duration_ms: z.ZodOptional<z.ZodNumber>;
        total_lines_added: z.ZodOptional<z.ZodNumber>;
        total_lines_removed: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    context_window: z.ZodObject<{
        total_input_tokens: z.ZodNumber;
        total_output_tokens: z.ZodNumber;
        context_window_size: z.ZodNumber;
        current_usage: z.ZodNullable<z.ZodObject<{
            input_tokens: z.ZodNumber;
            output_tokens: z.ZodNumber;
            cache_creation_input_tokens: z.ZodNumber;
            cache_read_input_tokens: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Type inference from schema
 *
 * These types are automatically inferred from the Zod schemas,
 * ensuring compile-time and run-time type safety are in sync.
 */
export type StdinData = z.infer<typeof StdinDataSchema>;
export type ContextUsage = z.infer<typeof ContextUsageSchema>;
export type CostInfo = z.infer<typeof CostInfoSchema>;
export type ContextWindow = z.infer<typeof ContextWindowSchema>;
export type ModelInfo = z.infer<typeof ModelInfoSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type OutputStyle = z.infer<typeof OutputStyleSchema>;
//# sourceMappingURL=stdin-schema.d.ts.map