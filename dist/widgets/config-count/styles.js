/**
 * Functional style renderers for ConfigCountWidget
 */
import { colorize } from "../../ui/utils/colors.js";
export const configCountStyles = {
    balanced: (data, colors) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors?.semantic.info ?? "";
        const muted = colors?.base.muted ?? "";
        if (claudeMdCount > 0) {
            const label = info ? colorize("CLAUDE.md", info) : "CLAUDE.md";
            parts.push(`${label}:${claudeMdCount}`);
        }
        if (rulesCount > 0) {
            const label = info ? colorize("rules", info) : "rules";
            parts.push(`${label}:${rulesCount}`);
        }
        if (mcpCount > 0) {
            const label = info ? colorize("MCPs", info) : "MCPs";
            parts.push(`${label}:${mcpCount}`);
        }
        if (hooksCount > 0) {
            const label = info ? colorize("hooks", info) : "hooks";
            parts.push(`${label}:${hooksCount}`);
        }
        const sep = muted ? colorize(" │ ", muted) : " │ ";
        return parts.join(sep);
    },
    compact: (data, colors) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors?.semantic.info ?? "";
        const muted = colors?.base.muted ?? "";
        if (claudeMdCount > 0) {
            const text = info ? colorize(`${claudeMdCount} docs`, info) : `${claudeMdCount} docs`;
            parts.push(text);
        }
        if (rulesCount > 0) {
            const text = info ? colorize(`${rulesCount} rules`, info) : `${rulesCount} rules`;
            parts.push(text);
        }
        if (mcpCount > 0) {
            const text = info ? colorize(`${mcpCount} MCPs`, info) : `${mcpCount} MCPs`;
            parts.push(text);
        }
        if (hooksCount > 0) {
            const hookLabel = hooksCount === 1 ? "hook" : "hooks";
            const text = info
                ? colorize(`${hooksCount} ${hookLabel}`, info)
                : `${hooksCount} ${hookLabel}`;
            parts.push(text);
        }
        const sep = muted ? colorize(" │ ", muted) : " │ ";
        return parts.join(sep);
    },
    playful: (data, colors) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors?.semantic.info ?? "";
        const muted = colors?.base.muted ?? "";
        if (claudeMdCount > 0) {
            const text = info
                ? colorize(`CLAUDE.md:${claudeMdCount}`, info)
                : `CLAUDE.md:${claudeMdCount}`;
            parts.push(`📄 ${text}`);
        }
        if (rulesCount > 0) {
            const text = info ? colorize(`rules:${rulesCount}`, info) : `rules:${rulesCount}`;
            parts.push(`📜 ${text}`);
        }
        if (mcpCount > 0) {
            const text = info ? colorize(`MCPs:${mcpCount}`, info) : `MCPs:${mcpCount}`;
            parts.push(`🔌 ${text}`);
        }
        if (hooksCount > 0) {
            const text = info ? colorize(`hooks:${hooksCount}`, info) : `hooks:${hooksCount}`;
            parts.push(`🪝 ${text}`);
        }
        const sep = muted ? colorize(" │ ", muted) : " │ ";
        return parts.join(sep);
    },
    verbose: (data, colors) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors?.semantic.info ?? "";
        const muted = colors?.base.muted ?? "";
        if (claudeMdCount > 0) {
            const text = info
                ? colorize(`${claudeMdCount} CLAUDE.md`, info)
                : `${claudeMdCount} CLAUDE.md`;
            parts.push(text);
        }
        if (rulesCount > 0) {
            const text = info ? colorize(`${rulesCount} rules`, info) : `${rulesCount} rules`;
            parts.push(text);
        }
        if (mcpCount > 0) {
            const text = info ? colorize(`${mcpCount} MCP servers`, info) : `${mcpCount} MCP servers`;
            parts.push(text);
        }
        if (hooksCount > 0) {
            const text = info ? colorize(`${hooksCount} hooks`, info) : `${hooksCount} hooks`;
            parts.push(text);
        }
        const sep = muted ? colorize(" │ ", muted) : " │ ";
        return parts.join(sep);
    },
};
//# sourceMappingURL=styles.js.map