/**
 * Functional style renderers for ConfigCountWidget
 */
export const configCountStyles = {
    balanced: (data) => {
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
    },
    compact: (data) => {
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
    },
    playful: (data) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        if (claudeMdCount > 0) {
            parts.push(`📄 CLAUDE.md:${claudeMdCount}`);
        }
        if (rulesCount > 0) {
            parts.push(`📜 rules:${rulesCount}`);
        }
        if (mcpCount > 0) {
            parts.push(`🔌 MCPs:${mcpCount}`);
        }
        if (hooksCount > 0) {
            parts.push(`🪝 hooks:${hooksCount}`);
        }
        return parts.join(" │ ");
    },
    verbose: (data) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        if (claudeMdCount > 0) {
            parts.push(`${claudeMdCount} CLAUDE.md`);
        }
        if (rulesCount > 0) {
            parts.push(`${rulesCount} rules`);
        }
        if (mcpCount > 0) {
            parts.push(`${mcpCount} MCP servers`);
        }
        if (hooksCount > 0) {
            parts.push(`${hooksCount} hook`);
        }
        return parts.join(" │ ");
    },
};
//# sourceMappingURL=styles.js.map