/**
 * Git Changes Widget
 *
 * Displays git diff statistics (insertions/deletions)
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import type { IWidget, WidgetContext, RenderContext, StdinData } from '../../core/types.js';
import type { IGit } from '../../providers/git-provider.js';
/**
 * Widget displaying git diff statistics
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export declare class GitChangesWidget implements IWidget {
    readonly id = "git-changes";
    readonly metadata: import("../../core/types.js").IWidgetMetadata;
    private gitFactory;
    private git;
    private enabled;
    private cwd;
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     */
    constructor(gitFactory?: (cwd: string) => IGit);
    initialize(context: WidgetContext): Promise<void>;
    update(data: StdinData): Promise<void>;
    render(context: RenderContext): Promise<string | null>;
    isEnabled(): boolean;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=git-changes-widget.d.ts.map