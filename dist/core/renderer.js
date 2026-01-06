/**
 * Unified rendering engine
 * Combines widget outputs into statusline
 */
import { DEFAULTS } from '../constants.js';
/**
 * Renderer for combining widget outputs
 */
export class Renderer {
    separator = DEFAULTS.SEPARATOR;
    /**
     * Render widgets into a single line
     */
    async render(widgets, context) {
        const outputs = [];
        for (const widget of widgets) {
            if (!widget.isEnabled()) {
                continue;
            }
            const output = await widget.render(context);
            if (output !== null) {
                outputs.push(output);
            }
        }
        return outputs.join(this.separator);
    }
    /**
     * Set custom separator
     */
    setSeparator(separator) {
        this.separator = separator;
    }
}
//# sourceMappingURL=renderer.js.map