/**
 * Verbose style renderer for GitWidget
 * Output: "branch: main (HEAD)"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class GitVerboseRenderer extends BaseStyleRenderer {
    render(data) {
        return `branch: ${data.branch} (HEAD)`;
    }
}
//# sourceMappingURL=verbose.js.map