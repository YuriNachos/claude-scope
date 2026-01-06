/**
 * Git Changes Widget
 *
 * Displays git diff statistics (insertions/deletions)
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations that don't fit the Template Method Pattern.
 */
import type { IWidget, WidgetContext, RenderContext, StdinData } from '#core/types.js';
export declare class GitChangesWidget implements IWidget {
    readonly id = "git-changes";
    readonly metadata: import("#core/types.js").IWidgetMetadata;
    private git;
    private enabled;
    private cwd;
    constructor();
    initialize(context: WidgetContext): Promise<void>;
    update(data: StdinData): Promise<void>;
    render(context: RenderContext): Promise<string | null>;
    isEnabled(): boolean;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=git-changes-widget.d.ts.map