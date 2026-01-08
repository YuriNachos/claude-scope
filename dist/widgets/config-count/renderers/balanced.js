/**
 * Balanced style renderer for ConfigCountWidget
 * Output: "CLAUDE.md:2 │ rules:5 │ MCPs:3 │ hooks:1"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ConfigCountBalancedRenderer extends BaseStyleRenderer {
    render(data) {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        if (claudeMdCount > 0) {
            parts.push(`CLAUDE.md:${claudeMdCount}`);
        }
        if (rulesCount > 0) {
            parts.push(`rules:${rulesCount}`);
        }
        if (mcpCount > 0) {
            parts.push(`MCPs:${mcpCount}`);
        }
        if (hooksCount > 0) {
            parts.push(`hooks:${hooksCount}`);
        }
        return parts.join(" │ ");
    }
}
//# sourceMappingURL=balanced.js.map