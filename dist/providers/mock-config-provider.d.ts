/**
 * Mock Config provider for testing and preview mode
 * Returns realistic demo data without accessing actual filesystem
 */
import type { ConfigCounts, IConfigProvider } from "./config-provider.js";
/**
 * Mock Config provider with hardcoded demo data
 *
 * Demo data represents typical Claude Code project:
 * - 1 CLAUDE.md file
 * - 3 rules files
 * - 2 MCP servers configured
 * - 4 hooks installed
 */
export declare class MockConfigProvider implements IConfigProvider {
    /**
     * Return demo config counts
     * @returns Demo counts for CLAUDE.md, rules, MCPs, hooks
     */
    getConfigs(): Promise<ConfigCounts>;
}
//# sourceMappingURL=mock-config-provider.d.ts.map