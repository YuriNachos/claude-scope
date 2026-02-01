/**
 * Types for CWD (Current Working Directory) widget
 */

/**
 * Render data for CWD widget
 */
export interface CwdRenderData {
  /** Full path from StdinData.cwd */
  fullPath: string;
  /** Directory name (basename) */
  dirName: string;
}
