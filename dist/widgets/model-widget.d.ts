/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import type { RenderContext } from '../core/types.js';
export declare class ModelWidget extends StdinDataWidget {
    readonly id = "model";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    render(context: RenderContext): Promise<string | null>;
}
//# sourceMappingURL=model-widget.d.ts.map