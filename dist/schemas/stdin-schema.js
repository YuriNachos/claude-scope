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
export const ContextUsageSchema = z.object({
    input_tokens: z.number(),
    output_tokens: z.number(),
    cache_creation_input_tokens: z.number(),
    cache_read_input_tokens: z.number()
});
/**
 * Cost info schema
 * Details about session cost and duration
 */
export const CostInfoSchema = z.object({
    total_cost_usd: z.number(),
    total_duration_ms: z.number(),
    total_api_duration_ms: z.number(),
    total_lines_added: z.number(),
    total_lines_removed: z.number()
}).partial(); // Make all fields optional for backwards compatibility
/**
 * Context window schema
 * Information about token usage and limits
 */
export const ContextWindowSchema = z.object({
    total_input_tokens: z.number(),
    total_output_tokens: z.number(),
    context_window_size: z.number(),
    current_usage: ContextUsageSchema.nullable()
});
/**
 * Model info schema
 * Information about the Claude model being used
 */
export const ModelInfoSchema = z.object({
    id: z.string(),
    display_name: z.string()
});
/**
 * Workspace schema
 * Information about current working directory
 */
export const WorkspaceSchema = z.object({
    current_dir: z.string(),
    project_dir: z.string()
});
/**
 * Output style schema
 * Information about current output style
 */
export const OutputStyleSchema = z.object({
    name: z.string()
});
/**
 * Main stdin data schema
 *
 * This is the primary schema for validating Claude Code statusline data.
 * All fields are validated at runtime, and TypeScript types are inferred
 * automatically.
 */
export const StdinDataSchema = z.object({
    hook_event_name: z.literal('Status'),
    session_id: z.string(),
    transcript_path: z.string(),
    cwd: z.string(),
    model: ModelInfoSchema,
    workspace: WorkspaceSchema,
    version: z.string(),
    output_style: OutputStyleSchema,
    cost: CostInfoSchema.optional(),
    context_window: ContextWindowSchema
});
//# sourceMappingURL=stdin-schema.js.map