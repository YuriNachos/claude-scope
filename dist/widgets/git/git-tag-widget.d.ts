/**
 * Git Tag Widget
 * Displays the latest git tag
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import type { IWidget, WidgetContext, RenderContext, StdinData } from "../../core/types.js";
import type { IGit } from "../../providers/git-provider.js";
/**
 * Widget displaying the latest git tag
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export declare class GitTagWidget implements IWidget {
    readonly id = "git-tag";
    readonly metadata: import("../../core/types.js").IWidgetMetadata;
    private gitFactory;
    private git;
    private enabled;
    private cwd;
    private latestTag;
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     */
    constructor(gitFactory?: (cwd: string) => IGit);
    initialize(context: WidgetContext): Promise<void>;
    render(context: RenderContext): Promise<string | null>;
    update(data: StdinData): Promise<void>;
    isEnabled(): boolean;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=git-tag-widget.d.ts.map