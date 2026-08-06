/**
 * Git provider interface and implementation
 *
 * Uses native Node.js child_process to execute git commands,
 * avoiding external dependencies like simple-git.
 */

import { EXEC_TIMEOUTS } from "../constants.js";
import { type ExecFileFn, runCommand } from "../utils/exec.js";

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
  /** Number of changed files */
  fileCount: number;
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
  private execFn?: ExecFileFn;

  /**
   * @param cwd - Working directory for git operations
   * @param execFn - Optional exec function for testing (dependency injection)
   */
  constructor(cwd: string, execFn?: ExecFileFn) {
    this.cwd = cwd;
    this.execFn = execFn;
  }

  /**
   * Run a git command bounded by EXEC_TIMEOUTS.GIT_MS
   *
   * A git process can hang indefinitely (stale index.lock, unreachable network
   * remote, filesystem stall) and would otherwise block the whole statusline.
   */
  private run(args: string[]): Promise<string | null> {
    return runCommand("git", args, { cwd: this.cwd, timeout: EXEC_TIMEOUTS.GIT_MS }, this.execFn);
  }

  async status(): Promise<GitStatusResult> {
    const stdout = await this.run(["status", "--branch", "--short"]);
    if (stdout === null) {
      // Not in a git repo, git not available, or the command timed out
      return { current: null };
    }

    // Parse output like: "## main" or "## feature-branch"
    const match = stdout.match(/^##\s+(\S+)/m);
    return { current: match ? match[1] : null };
  }

  async diffSummary(options?: string[]): Promise<GitDiffSummary> {
    const args = ["diff", "--shortstat"];
    if (options) {
      args.push(...options);
    }

    const stdout = await this.run(args);
    if (stdout === null) {
      // Not in a git repo, git not available, or the command timed out
      return { fileCount: 0, files: [] };
    }

    // Parse output like: " 5 file(s) changed, 12 insertions(+), 3 deletions(-)"
    // or: " 2 insertions(+), 1 deletion(-)"
    const fileMatch = stdout.match(/(\d+)\s+file(s?)\s+changed/);
    const insertionMatch = stdout.match(/(\d+)\s+insertion/);
    const deletionMatch = stdout.match(/(\d+)\s+deletion/);

    const fileCount = fileMatch ? parseInt(fileMatch[1], 10) : 0;
    const insertions = insertionMatch ? parseInt(insertionMatch[1], 10) : 0;
    const deletions = deletionMatch ? parseInt(deletionMatch[1], 10) : 0;

    // Return a single "file" entry representing total changes
    // This matches the simple-git behavior we had before
    const files: GitDiffFile[] =
      insertions > 0 || deletions > 0 ? [{ file: "(total)", insertions, deletions }] : [];

    return { fileCount, files };
  }

  async latestTag(): Promise<string | null> {
    // Empty output is indistinguishable from "no tags", both mean no tag
    return (await this.run(["describe", "--tags", "--abbrev=0"])) || null;
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
