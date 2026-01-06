/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it has different lifecycle requirements:
 * - Uses GitProvider instead of transforming StdinData directly
 * - Maintains internal state (currentCwd) for change detection
 * - Needs to reinitialize GitProvider when cwd changes
 */
import { GitProvider } from '../providers/git-provider.js';
import { createWidgetMetadata } from '../core/widget-types.js';
/**
 * Widget displaying git branch information
 */
export class GitWidget {
    id = 'git';
    metadata = createWidgetMetadata('Git Widget', 'Displays current git branch');
    gitProvider;
    enabled = true;
    currentCwd = '';
    constructor(deps) {
        this.gitProvider = new GitProvider({ git: deps.git });
    }
    async initialize(context) {
        this.enabled = context.config?.enabled !== false;
    }
    async render(context) {
        if (!this.enabled || !this.gitProvider.isRepo()) {
            return null;
        }
        const branch = await this.gitProvider.getBranch();
        if (!branch) {
            return null;
        }
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