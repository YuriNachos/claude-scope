/**
 * Verbose style renderer for ContextWidget
 *
 * Output format: `142,847 / 200,000 tokens (71%)`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ContextVerboseRenderer extends BaseStyleRenderer {
    render(data) {
        const usedFormatted = data.used.toLocaleString();
        const maxFormatted = data.contextWindowSize.toLocaleString();
        return `${usedFormatted} / ${maxFormatted} tokens (${data.percent}%)`;
    }
}
//# sourceMappingURL=verbose.js.map