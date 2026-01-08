/**
 * Duration Widget
 *
 * Displays elapsed session time
 */
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import type { RenderContext, StdinData } from "../types.js";
export declare class DurationWidget extends StdinDataWidget {
    readonly id = "duration";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    protected renderWithData(data: StdinData, context: RenderContext): string | null;
}
//# sourceMappingURL=duration-widget.d.ts.map