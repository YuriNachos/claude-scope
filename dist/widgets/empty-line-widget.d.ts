/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import type { RenderContext } from '../types.js';
import type { StdinData } from '../types.js';
export declare class EmptyLineWidget extends StdinDataWidget {
    readonly id = "empty-line";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    /**
     * Return empty string regardless of data state.
     * The empty line widget doesn't need stdin data to render.
     */
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
}
//# sourceMappingURL=empty-line-widget.d.ts.map