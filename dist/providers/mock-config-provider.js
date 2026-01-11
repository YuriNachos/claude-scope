/**
 * Mock Config provider for testing and preview mode
 * Returns realistic demo data without accessing actual filesystem
 */
/**
 * Mock Config provider with hardcoded demo data
 *
 * Demo data represents typical Claude Code project:
 * - 1 CLAUDE.md file
 * - 3 rules files
 * - 2 MCP servers configured
 * - 4 hooks installed
 */
export class MockConfigProvider {
    /**
     * Return demo config counts
     * @returns Demo counts for CLAUDE.md, rules, MCPs, hooks
     */
    async getConfigs() {
        return {
            claudeMdCount: 1,
            rulesCount: 3,
            mcpCount: 2,
            hooksCount: 4,
        };
    }
}
//# sourceMappingURL=mock-config-provider.js.map