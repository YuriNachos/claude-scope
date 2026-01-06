/**
 * Mock git implementation for testing
 *
 * Provides deterministic, fast git operations without
 * creating real git repositories or executing git commands.
 */

import type {
  IGit,
  GitStatusResult,
  GitDiffSummary,
  GitDiffFile,
} from '../../src/providers/git-provider.js';

/**
 * Mock git implementation for unit tests
 *
 * Allows full control over git state without external dependencies.
 */
export class MockGit implements IGit {
  private _currentBranch: string | null = 'main';
  private _diffFiles: GitDiffFile[] = [];

  /**
   * Set the current branch name
   * @param branch - Branch name or null for detached HEAD
   */
  setBranch(branch: string | null): void {
    this._currentBranch = branch;
  }

  /**
   * Set the diff statistics
   * @param files - Array of file changes to simulate
   */
  setDiff(files: GitDiffFile[]): void {
    this._diffFiles = files;
  }

  /**
   * Clear all mock data (reset to defaults)
   */
  reset(): void {
    this._currentBranch = 'main';
    this._diffFiles = [];
  }

  async status(): Promise<GitStatusResult> {
    return {
      current: this._currentBranch,
    };
  }

  async diffSummary(): Promise<GitDiffSummary> {
    return { files: this._diffFiles };
  }
}

/**
 * Factory function to create a MockGit instance
 *
 * @returns IGit mock instance
 */
export function createMockGit(): MockGit {
  return new MockGit();
}
