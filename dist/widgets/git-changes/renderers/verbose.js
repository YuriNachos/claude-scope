/**
 * Verbose style renderer for GitChangesWidget
 * Output: "+142 insertions, -27 deletions"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitChangesVerboseRenderer extends BaseStyleRenderer {
    render(data) {
        const parts = [];
        if (data.insertions > 0)
            parts.push(`+${data.insertions} insertions`);
        if (data.deletions > 0)
            parts.push(`-${data.deletions} deletions`);
        return parts.join(", ");
    }
}
//# sourceMappingURL=verbose.js.map