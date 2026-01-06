/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it has different lifecycle requirements:
 * - Uses GitProvider instead of transforming StdinData directly
 * - Maintains internal state (currentCwd) for change detection
 * - Needs to reinitialize GitProvider when cwd changes
 */
import type { IWidget, WidgetContext, RenderContext, StdinData } from '../core/types.js';
import type { GitProviderDeps } from '../providers/git-provider.js';
/**
 * Git widget dependencies
 */
export interface GitWidgetDeps {
    git: GitProviderDeps['git'];
}
/**
 * Widget displaying git branch information
 */
export declare class GitWidget implements IWidget {
    readonly id = "git";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private gitProvider;
    private enabled;
    private currentCwd;
    constructor(deps: GitWidgetDeps);
    initialize(context: WidgetContext): Promise<void>;
    render(context: RenderContext): Promise<string | null>;
    update(data: StdinData): Promise<void>;
    isEnabled(): boolean;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=git-widget.d.ts.map