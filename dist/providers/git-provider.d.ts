/**
 * Git operations provider
 * Wraps simple-git for dependency injection
 */
import type { GitInfo } from '../types.js';
/**
 * Git interface for dependency injection
 */
export interface IGit {
    checkIsRepo(): Promise<boolean>;
    branch(): Promise<{
        current: string | null;
        all: string[];
    }>;
}
/**
 * Dependencies for GitProvider
 */
export interface GitProviderDeps {
    git: IGit;
}
/**
 * Git provider for repository operations
 */
export declare class GitProvider {
    private git;
    private repoPath;
    private _isRepo;
    constructor(deps: GitProviderDeps);
    /**
     * Initialize provider with repository path
     */
    init(path: string): Promise<void>;
    /**
     * Get current branch name
     * @returns Branch name or null if not in repo
     */
    getBranch(): Promise<string | null>;
    /**
     * Check if current path is a git repository
     */
    isRepo(): boolean;
    /**
     * Get complete git info
     */
    getInfo(): Promise<GitInfo>;
}
//# sourceMappingURL=git-provider.d.ts.map