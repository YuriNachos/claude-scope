/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
export class EmptyLineWidget extends StdinDataWidget {
    id = 'empty-line';
    metadata = createWidgetMetadata('Empty Line', 'Empty line separator', '1.0.0', 'claude-scope', 3 // Fourth line (0-indexed)
    );
    /**
     * Return Braille Pattern Blank to create a visible empty separator line.
     * U+2800 occupies cell width but appears blank, ensuring the line renders.
     */
    renderWithData(_data, _context) {
        return '\u2800'; // Braille Pattern Blank - looks empty but takes space
    }
}
//# sourceMappingURL=empty-line-widget.js.map