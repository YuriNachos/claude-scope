/**
 * Cost Widget
 *
 * Displays total session cost
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import type { RenderContext, StdinData } from '../types.js';
export declare class CostWidget extends StdinDataWidget {
    readonly id = "cost";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    protected renderWithData(data: StdinData, context: RenderContext): string | null;
}
//# sourceMappingURL=cost-widget.d.ts.map