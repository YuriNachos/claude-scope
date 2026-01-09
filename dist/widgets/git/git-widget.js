/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import { createWidgetMetadata } from "../../core/widget-types.js";
import { createGit } from "../../providers/git-provider.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import { gitStyles } from "./styles.js";
/**
 * Widget displaying git branch information
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitWidget {
    id = "git";
    metadata = createWidgetMetadata("Git Widget", "Displays current git branch", "1.0.0", "claude-scope", 0 // First line
    );
    gitFactory;
    git = null;
    enabled = true;
    cwd = null;
    colors;
    styleFn = gitStyles.balanced;
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
        const fn = gitStyles[style];
        if (fn) {
            this.styleFn = fn;
        }
    }
    async initialize(context) {
        this.enabled = context.config?.enabled !== false;
    }
    async render(_context) {
        if (!this.enabled || !this.git || !this.cwd) {
            return null;
        }
        try {
            const status = await this.git.status();
            const branch = status.current || null;
            if (!branch) {
                return null;
            }
            // Get git changes if available
            let changes;
            try {
                const diffSummary = await this.git.diffSummary();
                if (diffSummary.fileCount > 0) {
                    let insertions = 0;
                    let deletions = 0;
                    for (const file of diffSummary.files) {
                        insertions += file.insertions || 0;
                        deletions += file.deletions || 0;
                    }
                    if (insertions > 0 || deletions > 0) {
                        changes = { files: diffSummary.fileCount, insertions, deletions };
                    }
                }
            }
            catch {
                // Diff may fail, continue without changes
            }
            const renderData = { branch, changes };
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
//# sourceMappingURL=git-widget.js.map