/**
 * Compact-Verbose style renderer for ContextWidget
 *
 * Output format: `71% (142K/200K)`
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import { formatTokens } from "../../../ui/utils/style-utils.js";
export class ContextCompactVerboseRenderer extends BaseStyleRenderer {
    render(data) {
        const usedK = formatTokens(data.used);
        const maxK = formatTokens(data.contextWindowSize);
        return `${data.percent}% (${usedK}/${maxK})`;
    }
}
//# sourceMappingURL=compact-verbose.js.map