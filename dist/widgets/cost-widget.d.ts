/**
 * Cost Widget
 *
 * Displays session cost in USD
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import type { RenderContext } from '../core/types.js';
export declare class CostWidget extends StdinDataWidget {
    readonly id = "cost";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    render(context: RenderContext): Promise<string | null>;
}
//# sourceMappingURL=cost-widget.d.ts.map