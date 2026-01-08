/**
 * Runtime type-safe schema for Claude Code stdin data
 * Custom validation system (no external dependencies)
 */

import {
  string,
  number,
  literal,
  object,
  optional,
  nullable,
  partial,
} from "../validation/index.js";
import type { InferValidator } from "../validation/core.js";

export const ContextUsageSchema = object({
  input_tokens: number(),
  output_tokens: number(),
  cache_creation_input_tokens: number(),
  cache_read_input_tokens: number(),
});

export const CostInfoSchema = object({
  total_cost_usd: optional(number()),
  total_duration_ms: optional(number()),
  total_api_duration_ms: optional(number()),
  total_lines_added: optional(number()),
  total_lines_removed: optional(number()),
});

export const ContextWindowSchema = object({
  total_input_tokens: number(),
  total_output_tokens: number(),
  context_window_size: number(),
  current_usage: nullable(ContextUsageSchema),
});

export const ModelInfoSchema = object({
  id: string(),
  display_name: string(),
});

export const WorkspaceSchema = object({
  current_dir: string(),
  project_dir: string(),
});

export const OutputStyleSchema = object({
  name: string(),
});

export const StdinDataSchema = object({
  hook_event_name: optional(literal("Status")),
  session_id: string(),
  transcript_path: string(),
  cwd: string(),
  model: ModelInfoSchema,
  workspace: WorkspaceSchema,
  version: string(),
  output_style: OutputStyleSchema,
  cost: optional(CostInfoSchema),
  context_window: ContextWindowSchema,
});

export type StdinData = InferValidator<typeof StdinDataSchema>;
export type ContextUsage = InferValidator<typeof ContextUsageSchema>;
export type CostInfo = InferValidator<typeof CostInfoSchema>;
export type ContextWindow = InferValidator<typeof ContextWindowSchema>;
export type ModelInfo = InferValidator<typeof ModelInfoSchema>;
export type Workspace = InferValidator<typeof WorkspaceSchema>;
export type OutputStyle = InferValidator<typeof OutputStyleSchema>;
