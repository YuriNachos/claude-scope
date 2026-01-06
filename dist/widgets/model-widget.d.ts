/**
 * Model Widget
 *
 * Displays the current Claude model name
 */
import { StdinDataWidget } from '#widgets/core/stdin-data-widget.js';
import type { RenderContext, StdinData } from '#types.js';
export declare class ModelWidget extends StdinDataWidget {
    readonly id = "model";
    readonly metadata: import("../core/types").IWidgetMetadata;
    protected renderWithData(data: StdinData, context: RenderContext): string | null;
}
//# sourceMappingURL=model-widget.d.ts.map