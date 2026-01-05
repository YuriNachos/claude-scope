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
 * Data received from Claude Code via stdin
 */
export interface StdinData {
    session_id: string;
    cwd: string;
    model: ModelInfo;
}
/**
 * Git repository information
 */
export interface GitInfo {
    branch: string | null;
    isRepo: boolean;
}
/**
 * Rendering context passed to widgets
 */
export interface RenderContext {
    width: number;
    timestamp: number;
}
//# sourceMappingURL=types.d.ts.map