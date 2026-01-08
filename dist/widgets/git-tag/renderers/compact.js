/**
 * Compact style renderer for GitTagWidget
 * Output: "0.5.4" or "—" (removes "v" prefix)
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitTagCompactRenderer extends BaseStyleRenderer {
    render(data) {
        if (!data.tag)
            return "—";
        // Remove "v" prefix if present
        return data.tag.replace(/^v/, "");
    }
}
//# sourceMappingURL=compact.js.map