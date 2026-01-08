/**
 * Git Tag Widget
 * Displays the latest git tag
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import { createWidgetMetadata } from "../../core/widget-types.js";
import { createGit } from "../../providers/git-provider.js";
import { GitTagBalancedRenderer } from "../git-tag/renderers/balanced.js";
import { GitTagCompactRenderer } from "../git-tag/renderers/compact.js";
import { GitTagFancyRenderer } from "../git-tag/renderers/fancy.js";
import { GitTagIndicatorRenderer } from "../git-tag/renderers/indicator.js";
import { GitTagLabeledRenderer } from "../git-tag/renderers/labeled.js";
import { GitTagPlayfulRenderer } from "../git-tag/renderers/playful.js";
import { GitTagVerboseRenderer } from "../git-tag/renderers/verbose.js";
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
    renderer = new GitTagBalancedRenderer();
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     */
    constructor(gitFactory) {
        this.gitFactory = gitFactory || createGit;
    }
    setStyle(style) {
        switch (style) {
            case "balanced":
                this.renderer = new GitTagBalancedRenderer();
                break;
            case "compact":
                this.renderer = new GitTagCompactRenderer();
                break;
            case "playful":
                this.renderer = new GitTagPlayfulRenderer();
                break;
            case "verbose":
                this.renderer = new GitTagVerboseRenderer();
                break;
            case "labeled":
                this.renderer = new GitTagLabeledRenderer();
                break;
            case "indicator":
                this.renderer = new GitTagIndicatorRenderer();
                break;
            case "fancy":
                this.renderer = new GitTagFancyRenderer();
                break;
            default:
                this.renderer = new GitTagBalancedRenderer();
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
            return this.renderer.render({ tag: latestTag });
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