/**
 * Git provider interface and implementation
 *
 * Uses native Node.js child_process to execute git commands,
 * avoiding external dependencies like simple-git.
 */
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
export declare class NativeGit implements IGit {
    private cwd;
    constructor(cwd: string);
    status(): Promise<GitStatusResult>;
    diffSummary(options?: string[]): Promise<GitDiffSummary>;
    latestTag(): Promise<string | null>;
}
/**
 * Factory function to create NativeGit instance
 *
 * @param cwd - Working directory for git operations
 * @returns IGit instance
 */
export declare function createGit(cwd: string): IGit;
//# sourceMappingURL=git-provider.d.ts.map