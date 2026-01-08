/**
 * Git Changes Widget
 *
 * Displays git diff statistics (insertions/deletions)
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import { createWidgetMetadata } from "../../core/widget-types.js";
import { createGit } from "../../providers/git-provider.js";
import { GitChangesBalancedRenderer } from "../git-changes/renderers/balanced.js";
import { GitChangesCompactRenderer } from "../git-changes/renderers/compact.js";
import { GitChangesFancyRenderer } from "../git-changes/renderers/fancy.js";
import { GitChangesIndicatorRenderer } from "../git-changes/renderers/indicator.js";
import { GitChangesLabeledRenderer } from "../git-changes/renderers/labeled.js";
import { GitChangesPlayfulRenderer } from "../git-changes/renderers/playful.js";
import { GitChangesSymbolicRenderer } from "../git-changes/renderers/symbolic.js";
import { GitChangesTechnicalRenderer } from "../git-changes/renderers/technical.js";
import { GitChangesVerboseRenderer } from "../git-changes/renderers/verbose.js";
/**
 * Widget displaying git diff statistics
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitChangesWidget {
    id = "git-changes";
    metadata = createWidgetMetadata("Git Changes", "Displays git diff statistics", "1.0.0", "claude-scope", 0 // First line
    );
    gitFactory;
    git = null;
    enabled = true;
    cwd = null;
    renderer = new GitChangesBalancedRenderer();
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
                this.renderer = new GitChangesBalancedRenderer();
                break;
            case "compact":
                this.renderer = new GitChangesCompactRenderer();
                break;
            case "playful":
                this.renderer = new GitChangesPlayfulRenderer();
                break;
            case "verbose":
                this.renderer = new GitChangesVerboseRenderer();
                break;
            case "technical":
                this.renderer = new GitChangesTechnicalRenderer();
                break;
            case "symbolic":
                this.renderer = new GitChangesSymbolicRenderer();
                break;
            case "labeled":
                this.renderer = new GitChangesLabeledRenderer();
                break;
            case "indicator":
                this.renderer = new GitChangesIndicatorRenderer();
                break;
            case "fancy":
                this.renderer = new GitChangesFancyRenderer();
                break;
            default:
                this.renderer = new GitChangesBalancedRenderer();
        }
    }
    async initialize(context) {
        this.enabled = context.config?.enabled !== false;
    }
    async update(data) {
        // Re-initialize git if cwd changed
        if (data.cwd !== this.cwd) {
            this.cwd = data.cwd;
            this.git = this.gitFactory(data.cwd);
        }
    }
    async render(context) {
        if (!this.enabled || !this.git || !this.cwd) {
            return null;
        }
        let changes;
        try {
            const summary = await this.git.diffSummary(["--shortstat"]);
            let insertions = 0;
            let deletions = 0;
            if (summary.files && summary.files.length > 0) {
                for (const file of summary.files) {
                    if (typeof file.insertions === "number") {
                        insertions += file.insertions;
                    }
                    if (typeof file.deletions === "number") {
                        deletions += file.deletions;
                    }
                }
            }
            if (insertions === 0 && deletions === 0) {
                return null;
            }
            changes = { insertions, deletions };
        }
        catch {
            // Log specific error for debugging but return null (graceful degradation)
            return null;
        }
        if (!changes)
            return null;
        if (changes.insertions === 0 && changes.deletions === 0) {
            return null;
        }
        return this.renderer.render(changes);
    }
    isEnabled() {
        return this.enabled;
    }
    async cleanup() {
        // No cleanup needed for native git implementation
    }
}
//# sourceMappingURL=git-changes-widget.js.map