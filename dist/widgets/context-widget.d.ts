/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import type { RenderContext } from '../core/types.js';
export declare class ContextWidget extends StdinDataWidget {
    readonly id = "context";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    render(context: RenderContext): Promise<string | null>;
}
//# sourceMappingURL=context-widget.d.ts.map