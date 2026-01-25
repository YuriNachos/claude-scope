/**
 * Runtime type-safe schema for Claude Code stdin data
 * Custom validation system (no external dependencies)
 */

import type { InferValidator } from "../validation/core.js";
import { literal, nullable, number, object, optional, string } from "../validation/index.js";

export const ContextUsageSchema = object({
  input_tokens: number(),
  output_tokens: number(),
  cache_creation_input_tokens: number(),
  cache_read_input_tokens: number(),
});

export const ContextWindowSchema = object({
  total_input_tokens: optional(number()),
  total_output_tokens: optional(number()),
  context_window_size: optional(number()),
  current_usage: nullable(ContextUsageSchema),
  // Pre-calculated percentages from Claude Code (available in newer versions)
  used_percentage: optional(number()),
  remaining_percentage: optional(number()),
});

export const CostInfoSchema = object({
  total_cost_usd: optional(number()),
  total_duration_ms: optional(number()),
  total_api_duration_ms: optional(number()),
  total_lines_added: optional(number()),
  total_lines_removed: optional(number()),
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
  session_id: optional(string()),
  transcript_path: optional(string()),
  cwd: optional(string()),
  model: optional(ModelInfoSchema),
  workspace: optional(WorkspaceSchema),
  version: optional(string()),
  output_style: optional(OutputStyleSchema),
  cost: optional(CostInfoSchema),
  context_window: optional(ContextWindowSchema),
});

export type StdinData = InferValidator<typeof StdinDataSchema>;
export type ContextUsage = InferValidator<typeof ContextUsageSchema>;
export type CostInfo = InferValidator<typeof CostInfoSchema>;
export type ContextWindow = InferValidator<typeof ContextWindowSchema>;
export type ModelInfo = InferValidator<typeof ModelInfoSchema>;
export type Workspace = InferValidator<typeof WorkspaceSchema>;
export type OutputStyle = InferValidator<typeof OutputStyleSchema>;
