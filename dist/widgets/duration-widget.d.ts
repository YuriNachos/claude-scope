/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import type { RenderContext } from '../core/types.js';
export declare class DurationWidget extends StdinDataWidget {
    readonly id = "duration";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    render(context: RenderContext): Promise<string | null>;
}
//# sourceMappingURL=duration-widget.d.ts.map