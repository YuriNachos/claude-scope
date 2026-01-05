/**
 * Git Changes Widget
 *
 * Displays git diff statistics
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import type { IGit } from '../providers/git-provider.js';
import type { RenderContext } from '../core/types.js';
export declare class GitChangesWidget extends StdinDataWidget {
    private gitProvider;
    readonly id = "git-changes";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    constructor(gitProvider: IGit);
    render(context: RenderContext): Promise<string | null>;
}
//# sourceMappingURL=git-changes-widget.d.ts.map