/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import type { RenderContext, StdinData } from "../types.js";
export declare class EmptyLineWidget extends StdinDataWidget {
    readonly id = "empty-line";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    /**
     * Return Braille Pattern Blank to create a visible empty separator line.
     * U+2800 occupies cell width but appears blank, ensuring the line renders.
     */
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=empty-line-widget.d.ts.map