/**
 * Git Tag Widget
 * Displays the latest git tag
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */
import type { WidgetStyle } from "../../core/style-types.js";
import type { IWidget, RenderContext, StdinData, WidgetContext } from "../../core/types.js";
import type { IGit } from "../../providers/git-provider.js";
import type { IThemeColors } from "../../ui/theme/types.js";
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
    private colors;
    private styleFn;
    /**
     * @param gitFactory - Optional factory function for creating IGit instances
     *                     If not provided, uses default createGit (production)
     *                     Tests can inject MockGit factory here
     * @param colors - Optional theme colors
     */
    constructor(gitFactory?: (cwd: string) => IGit, colors?: IThemeColors);
    setStyle(style?: WidgetStyle): void;
    initialize(context: WidgetContext): Promise<void>;
    render(_context: RenderContext): Promise<string | null>;
    update(data: StdinData): Promise<void>;
    isEnabled(): boolean;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=git-tag-widget.d.ts.map