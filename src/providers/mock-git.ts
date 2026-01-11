/**
 * Mock Git provider for testing and preview mode
 * Returns realistic demo data without accessing actual git repository
 */

import type { GitDiffSummary, GitStatusResult, IGit } from "./git-provider.js";

/**
 * Mock Git provider with hardcoded demo data
 *
 * Demo data represents:
 * - Active development branch
 * - Recent changes (3 files modified)
 * - Latest release tag
 */
export class MockGit implements IGit {
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: kept for API consistency with NativeGit
  private cwd: string;

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  /**
   * Return demo git status
   * @returns Status with "main" branch
   */
  async status(): Promise<GitStatusResult> {
    return { current: "main" };
  }

  /**
   * Return demo diff summary
   * @returns Diff with 3 files, 142 insertions, 27 deletions
   */
  async diffSummary(_options?: string[]): Promise<GitDiffSummary> {
    return {
      fileCount: 3,
      files: [
        { file: "src/widget.ts", insertions: 85, deletions: 12 },
        { file: "src/config.ts", insertions: 42, deletions: 8 },
        { file: "tests/widget.test.ts", insertions: 15, deletions: 7 },
      ],
    };
  }

  /**
   * Return demo latest tag
   * @returns Current version tag
   */
  async latestTag(): Promise<string | null> {
    return "v0.8.3";
  }
}
