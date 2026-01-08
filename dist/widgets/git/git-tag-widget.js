/**
 * Git Tag Widget
 * Displays the latest git tag
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import { createWidgetMetadata } from "../../core/widget-types.js";
import { createGit } from "../../providers/git-provider.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import { gitTagStyles } from "../git-tag/styles.js";
/**
 * Widget displaying the latest git tag
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitTagWidget {
    id = "git-tag";
    metadata = createWidgetMetadata("Git Tag Widget", "Displays the latest git tag", "1.0.0", "claude-scope", 1 // Second line
    );
    gitFactory;
    git = null;
    enabled = true;
    cwd = null;
    colors;
    styleFn = gitTagStyles.balanced;
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     * @param colors - Optional theme colors
     */
    constructor(gitFactory, colors) {
        this.gitFactory = gitFactory || createGit;
        this.colors = colors ?? DEFAULT_THEME;
    }
    setStyle(style = "balanced") {
        const fn = gitTagStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    async initialize(context) {
        this.enabled = context.config?.enabled !== false;
    }
    async render(context) {
        if (!this.enabled || !this.git || !this.cwd) {
            return null;
        }
        try {
            // Fetch the latest tag
            const latestTag = await (this.git.latestTag?.() ?? Promise.resolve(null));
            const renderData = { tag: latestTag };
            return this.styleFn(renderData, this.colors.git);
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
//# sourceMappingURL=git-tag-widget.js.map