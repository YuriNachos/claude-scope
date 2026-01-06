/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import { createWidgetMetadata } from '../../core/widget-types.js';
import { createGit } from '../../providers/git-provider.js';
/**
 * Widget displaying git branch information
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitWidget {
    id = 'git';
    metadata = createWidgetMetadata('Git Widget', 'Displays current git branch');
    gitFactory;
    git = null;
    enabled = true;
    cwd = null;
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     */
    constructor(gitFactory) {
        this.gitFactory = gitFactory || createGit;
    }
    async initialize(context) {
        this.enabled = context.config?.enabled !== false;
    }
    async render(context) {
        if (!this.enabled || !this.git || !this.cwd) {
            return null;
        }
        try {
            const status = await this.git.status();
            const branch = status.current || null;
            if (!branch) {
                return null;
            }
            return ` ${branch}`;
        }
        catch {
            // Log specific error for debugging but return null (graceful degradation)
            return null;
        }
    }
    async update(data) {
        // Re-initialize git if cwd changed
        if (data.cwd !== this.cwd) {
            this.cwd = data.cwd;
            this.git = this.gitFactory(data.cwd);
        }
    }
    isEnabled() {
        return this.enabled;
    }
    async cleanup() {
        // No cleanup needed for native git implementation
    }
}
//# sourceMappingURL=git-widget.js.map