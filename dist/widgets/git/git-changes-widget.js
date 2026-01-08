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
import { gitChangesStyles } from "../git-changes/styles.js";
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
    styleFn = gitChangesStyles.balanced;
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     */
    constructor(gitFactory) {
        this.gitFactory = gitFactory || createGit;
    }
    setStyle(style = "balanced") {
        const fn = gitChangesStyles[style];
        if (fn) {
            this.styleFn = fn;
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
        const renderData = changes;
        return this.styleFn(renderData);
    }
    isEnabled() {
        return this.enabled;
    }
    async cleanup() {
        // No cleanup needed for native git implementation
    }
}
//# sourceMappingURL=git-changes-widget.js.map