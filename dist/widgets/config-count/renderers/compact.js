/**
 * Compact style renderer for ConfigCountWidget
 * Output: "2 docs │ 5 rules │ 3 MCPs │ 1 hook"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class ConfigCountCompactRenderer extends BaseStyleRenderer {
    render(data) {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        if (claudeMdCount > 0) {
            parts.push(`${claudeMdCount} docs`);
        }
        if (rulesCount > 0) {
            parts.push(`${rulesCount} rules`);
        }
        if (mcpCount > 0) {
            parts.push(`${mcpCount} MCPs`);
        }
        if (hooksCount > 0) {
            const hookLabel = hooksCount === 1 ? "hook" : "hooks";
            parts.push(`${hooksCount} ${hookLabel}`);
        }
        return parts.join(" │ ");
    }
}
//# sourceMappingURL=compact.js.map