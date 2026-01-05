/**
 * Git operations provider
 * Wraps simple-git for dependency injection
 */
import { simpleGit } from 'simple-git';
/**
 * Git provider for repository operations
 */
export class GitProvider {
    git;
    repoPath;
    _isRepo = false;
    constructor(deps) {
        this.git = deps.git;
        this.repoPath = '';
    }
    /**
     * Initialize provider with repository path
     */
    async init(path) {
        this.repoPath = path;
        this._isRepo = await this.git.checkIsRepo();
    }
    /**
     * Get current branch name
     * @returns Branch name or null if not in repo
     */
    async getBranch() {
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
    async getChanges() {
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
    isRepo() {
        return this._isRepo;
    }
    /**
     * Get complete git info
     */
    async getInfo() {
        return {
            branch: await this.getBranch(),
            isRepo: this.isRepo()
        };
    }
}
/**
 * Adapter to wrap simple-git with our IGit interface
 */
class SimpleGitAdapter {
    git;
    constructor(git) {
        this.git = git;
    }
    async checkIsRepo() {
        try {
            await this.git.status();
            return true;
        }
        catch {
            return false;
        }
    }
    async branch() {
        const branches = await this.git.branch();
        return {
            current: branches.current || null,
            all: branches.all
        };
    }
    async diffStats() {
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
        }
        catch {
            return null;
        }
    }
}
/**
 * Factory method to create an IGit instance from simple-git
 * @param gitInstance - Optional simple-git instance (creates default if not provided)
 * @returns IGit implementation
 */
export function createGitAdapter(gitInstance) {
    const git = gitInstance ?? simpleGit();
    return new SimpleGitAdapter(git);
}
//# sourceMappingURL=git-provider.js.map