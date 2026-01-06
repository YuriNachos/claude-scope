/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it has different lifecycle requirements:
 * - Uses simple-git directly for git operations
 * - Maintains internal state (currentCwd) for change detection
 * - Needs to reinitialize git instance when cwd changes
 */
import type { IWidget, WidgetContext, RenderContext, StdinData } from '#core/types.js';
/**
 * Widget displaying git branch information
 */
export declare class GitWidget implements IWidget {
    readonly id = "git";
    readonly metadata: import("#core/types.js").IWidgetMetadata;
    private git;
    private enabled;
    private cwd;
    constructor();
    initialize(context: WidgetContext): Promise<void>;
    render(context: RenderContext): Promise<string | null>;
    update(data: StdinData): Promise<void>;
    isEnabled(): boolean;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=git-widget.d.ts.map