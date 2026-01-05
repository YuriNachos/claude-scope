/**
 * Shared types used across the application
 */

/**
 * Model information from Claude Code
 */
export interface ModelInfo {
  id: string;
  display_name: string;
}

/**
 * Output style configuration
 */
export interface OutputStyle {
  name: string;
}

/**
 * Workspace information
 */
export interface WorkspaceInfo {
  current_dir: string;
  project_dir: string;
}

/**
 * Cost and activity information
 */
export interface CostInfo {
  total_cost_usd: number;
  total_duration_ms: number;
  total_api_duration_ms: number;
  total_lines_added: number;
  total_lines_removed: number;
}

/**
 * Current context window usage
 */
export interface ContextUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
}

/**
 * Context window information
 */
export interface ContextWindow {
  total_input_tokens: number;
  total_output_tokens: number;
  context_window_size: number;
  current_usage: ContextUsage | null;
}

/**
 * Data received from Claude Code via stdin
 */
export interface StdinData {
  hook_event_name: "Status";
  session_id: string;
  transcript_path: string;
  cwd: string;
  model: ModelInfo;
  workspace: WorkspaceInfo;
  version: string;
  output_style: OutputStyle;
  cost: CostInfo;
  context_window: ContextWindow;
}

/**
 * Git repository information
 */
export interface GitInfo {
  branch: string | null;
  isRepo: boolean;
}

/**
 * Git change statistics
 */
export interface GitChanges {
  insertions: number;
  deletions: number;
}

/**
 * Rendering context passed to widgets
 */
export interface RenderContext {
  width: number;
  timestamp: number;
}
