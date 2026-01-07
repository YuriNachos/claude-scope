/**
 * Context Widget
 *
 * Displays context window usage with progress bar
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import type { IContextColors } from '../ui/theme/types.js';
import type { RenderContext, StdinData } from '../types.js';
export declare class ContextWidget extends StdinDataWidget {
    readonly id = "context";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private colors;
    constructor(colors?: IContextColors);
    protected renderWithData(data: StdinData, context: RenderContext): string | null;
    private getContextColor;
}
//# sourceMappingURL=context-widget.d.ts.map