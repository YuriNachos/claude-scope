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
export declare class MockGit implements IGit {
    private cwd;
    constructor(cwd: string);
    /**
     * Return demo git status
     * @returns Status with "main" branch
     */
    status(): Promise<GitStatusResult>;
    /**
     * Return demo diff summary
     * @returns Diff with 3 files, 142 insertions, 27 deletions
     */
    diffSummary(_options?: string[]): Promise<GitDiffSummary>;
    /**
     * Return demo latest tag
     * @returns Current version tag
     */
    latestTag(): Promise<string | null>;
}
//# sourceMappingURL=mock-git.d.ts.map