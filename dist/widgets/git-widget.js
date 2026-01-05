/**
 * Git status widget
 * Displays current git branch
 */
import { GitProvider } from '../providers/git-provider.js';
/**
 * Widget displaying git branch information
 */
export class GitWidget {
    id = 'git';
    metadata = {
        name: 'Git Widget',
        description: 'Displays current git branch',
        version: '1.0.0',
        author: 'claude-scope'
    };
    gitProvider;
    enabled = true;
    currentCwd = '';
    constructor(deps) {
        this.gitProvider = new GitProvider({ git: deps.git });
    }
    async initialize(context) {
        // Initialize with config if needed
        this.enabled = context.config.enabled !== false;
    }
    async render(context) {
        if (!this.enabled || !this.gitProvider.isRepo()) {
            return null;
        }
        const branch = await this.gitProvider.getBranch();
        if (!branch) {
            return null;
        }
        // Simple format:  branch-name
        return ` ${branch}`;
    }
    async update(data) {
        if (data.cwd !== this.currentCwd) {
            this.currentCwd = data.cwd;
            await this.gitProvider.init(data.cwd);
        }
    }
    isEnabled() {
        return this.enabled;
    }
    async cleanup() {
        // No resources to clean up
    }
}
//# sourceMappingURL=git-widget.js.map