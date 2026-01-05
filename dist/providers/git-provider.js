/**
 * Git operations provider
 * Wraps simple-git for dependency injection
 */
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
//# sourceMappingURL=git-provider.js.map