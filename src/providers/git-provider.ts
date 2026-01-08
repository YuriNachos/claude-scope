/**
 * Git provider interface and implementation
 *
 * Uses native Node.js child_process to execute git commands,
 * avoiding external dependencies like simple-git.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Result of git status operation
 */
export interface GitStatusResult {
  /** Current branch name (null if no branch or detached HEAD) */
  current: string | null;
}

/**
 * Single file diff statistics
 */
export interface GitDiffFile {
  /** File path relative to repo root */
  file: string;
  /** Number of lines added */
  insertions: number;
  /** Number of lines deleted */
  deletions: number;
}

/**
 * Result of git diff --shortstat operation
 */
export interface GitDiffSummary {
  /** Array of changed files with statistics */
  files: GitDiffFile[];
}

/**
 * Interface for git operations
 *
 * Abstraction over git commands to enable:
 * - Easy testing with mocks
 * - Swapping implementations
 * - No tight coupling to specific git library
 */
export interface IGit {
  /**
   * Get current git status (branch name)
   * @returns Promise resolving to status info
   */
  status(): Promise<GitStatusResult>;

  /**
   * Get diff statistics (insertions/deletions)
   * @returns Promise resolving to diff summary
   */
  diffSummary(options?: string[]): Promise<GitDiffSummary>;

  /**
   * Get the latest git tag
   * @returns Promise resolving to tag name or null if no tags exist
   */
  latestTag?(): Promise<string | null>;
}

/**
 * Native git implementation using child_process
 *
 * Executes real git commands on the system.
 * Requires git to be installed and available in PATH.
 */
export class NativeGit implements IGit {
  private cwd: string;

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  async status(): Promise<GitStatusResult> {
    try {
      const { stdout } = await execFileAsync("git", ["status", "--branch", "--short"], {
        cwd: this.cwd,
      });

      // Parse output like: "## main" or "## feature-branch"
      const match = stdout.match(/^##\s+(\S+)/m);
      const current = match ? match[1] : null;

      return { current };
    } catch {
      // Not in a git repo or git not available
      return { current: null };
    }
  }

  async diffSummary(options?: string[]): Promise<GitDiffSummary> {
    const args = ["diff", "--shortstat"];
    if (options) {
      args.push(...options);
    }

    try {
      const { stdout } = await execFileAsync("git", args, {
        cwd: this.cwd,
      });

      // Parse output like: " 5 file(s) changed, 12 insertions(+), 3 deletions(-)"
      // or: " 2 insertions(+), 1 deletion(-)"
      const insertionMatch = stdout.match(/(\d+)\s+insertion/);
      const deletionMatch = stdout.match(/(\d+)\s+deletion/);

      const insertions = insertionMatch ? parseInt(insertionMatch[1], 10) : 0;
      const deletions = deletionMatch ? parseInt(deletionMatch[1], 10) : 0;

      // Return a single "file" entry representing total changes
      // This matches the simple-git behavior we had before
      const files: GitDiffFile[] =
        insertions > 0 || deletions > 0 ? [{ file: "(total)", insertions, deletions }] : [];

      return { files };
    } catch {
      // Not in a git repo or git not available
      return { files: [] };
    }
  }

  async latestTag(): Promise<string | null> {
    try {
      const { stdout } = await execFileAsync("git", ["describe", "--tags", "--abbrev=0"], {
        cwd: this.cwd,
      });
      return stdout.trim();
    } catch {
      // No tags found or not in a git repo
      return null;
    }
  }
}

/**
 * Factory function to create NativeGit instance
 *
 * @param cwd - Working directory for git operations
 * @returns IGit instance
 */
export function createGit(cwd: string): IGit {
  return new NativeGit(cwd);
}
