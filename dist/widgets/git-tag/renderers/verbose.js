/**
 * Verbose style renderer for GitTagWidget
 * Output: "version v0.5.4" or "version: none"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitTagVerboseRenderer extends BaseStyleRenderer {
    render(data) {
        if (!data.tag)
            return "version: none";
        return `version ${data.tag}`;
    }
}
//# sourceMappingURL=verbose.js.map