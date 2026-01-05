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
  branch(): Promise<{ current: string | null; all: string[] }>;
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
export class GitProvider {
  private git: IGit;
  private repoPath: string;
  private _isRepo: boolean = false;

  constructor(deps: GitProviderDeps) {
    this.git = deps.git;
    this.repoPath = '';
  }

  /**
   * Initialize provider with repository path
   */
  async init(path: string): Promise<void> {
    this.repoPath = path;
    this._isRepo = await this.git.checkIsRepo();
  }

  /**
   * Get current branch name
   * @returns Branch name or null if not in repo
   */
  async getBranch(): Promise<string | null> {
    if (!this._isRepo) {
      return null;
    }

    const result = await this.git.branch();
    return result.current;
  }

  /**
   * Check if current path is a git repository
   */
  isRepo(): boolean {
    return this._isRepo;
  }

  /**
   * Get complete git info
   */
  async getInfo(): Promise<GitInfo> {
    return {
      branch: await this.getBranch(),
      isRepo: this.isRepo()
    };
  }
}
