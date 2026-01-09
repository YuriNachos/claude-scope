/**
 * Shared types used across the application
 *
 * This file re-exports types from the Zod schema (single source of truth)
 * and defines additional types not related to stdin data validation.
 */

// Import types from Zod schema (single source of truth for stdin data)
import type {
  ContextUsage,
  ContextWindow,
  CostInfo,
  ModelInfo,
  OutputStyle,
  StdinData,
  Workspace,
} from "./schemas/stdin-schema.js";

// Re-export for convenience
export type { StdinData, ModelInfo, Workspace, OutputStyle, CostInfo, ContextWindow, ContextUsage };

// Workspace alias for backwards compatibility
export type WorkspaceInfo = Workspace;

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
