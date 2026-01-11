/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
export declare class EmptyLineWidget extends StdinDataWidget {
    readonly id = "empty-line";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private _lineOverride?;
    /**
     * All styles return the same value (Braille Pattern Blank).
     * This method exists for API consistency with other widgets.
     */
    setStyle(_style: WidgetStyle): void;
    setLine(line: number): void;
    getLine(): number;
    /**
     * Return Braille Pattern Blank to create a visible empty separator line.
     * U+2800 occupies cell width but appears blank, ensuring the line renders.
     */
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=empty-line-widget.d.ts.map