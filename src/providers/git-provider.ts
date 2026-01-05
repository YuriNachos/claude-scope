/**
 * Git operations provider
 * Wraps simple-git for dependency injection
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import type { GitInfo, GitChanges } from '../types.js';

/**
 * Git interface for dependency injection
 */
export interface IGit {
  checkIsRepo(): Promise<boolean>;
  branch(): Promise<{ current: string | null; all: string[] }>;
  diffStats(): Promise<{ insertions: number; deletions: number } | null>;
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
   * Get git diff statistics
   * @returns Changes with insertions and deletions, or null if not a repo
   */
  async getChanges(): Promise<GitChanges | null> {
    if (!this._isRepo) {
      return null;
    }

    const stats = await this.git.diffStats();
    if (!stats) {
      return null;
    }

    return {
      insertions: stats.insertions,
      deletions: stats.deletions
    };
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

/**
 * Adapter to wrap simple-git with our IGit interface
 */
class SimpleGitAdapter implements IGit {
  constructor(private git: SimpleGit) {}

  async checkIsRepo(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  async branch(): Promise<{ current: string | null; all: string[] }> {
    const branches = await this.git.branch();
    return {
      current: branches.current || null,
      all: branches.all
    };
  }

  async diffStats(): Promise<{ insertions: number; deletions: number } | null> {
    try {
      const summary = await this.git.diffSummary(['--shortstat']);

      // Parse the summary object
      let insertions = 0;
      let deletions = 0;

      if (summary.files && summary.files.length > 0) {
        for (const file of summary.files) {
          if ('insertions' in file && typeof file.insertions === 'number') {
            insertions += file.insertions;
          }
          if ('deletions' in file && typeof file.deletions === 'number') {
            deletions += file.deletions;
          }
        }
      }

      if (insertions === 0 && deletions === 0) {
        return null;
      }

      return { insertions, deletions };
    } catch {
      return null;
    }
  }
}

/**
 * Factory method to create an IGit instance from simple-git
 * @param gitInstance - Optional simple-git instance (creates default if not provided)
 * @returns IGit implementation
 */
export function createGitAdapter(gitInstance?: SimpleGit): IGit {
  const git = gitInstance ?? simpleGit();
  return new SimpleGitAdapter(git);
}
