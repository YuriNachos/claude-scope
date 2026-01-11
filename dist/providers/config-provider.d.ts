/**
 * Config Provider
 *
 * Scans Claude Code configuration files with hybrid caching.
 * Cache invalidates after 5 seconds.
 */
export interface ConfigCounts {
    claudeMdCount: number;
    rulesCount: number;
    mcpCount: number;
    hooksCount: number;
}
export interface ConfigScanOptions {
    cwd?: string;
}
/**
 * Interface for config provider operations
 *
 * Abstraction over config scanning to enable:
 * - Easy testing with mocks
 * - Preview mode with demo data
 * - No tight coupling to filesystem implementation
 */
export interface IConfigProvider {
    /**
     * Get config counts
     * @returns Promise resolving to config counts
     */
    getConfigs(options?: ConfigScanOptions): Promise<ConfigCounts>;
}
/**
 * Provider for scanning Claude Code configuration with caching
 */
export declare class ConfigProvider implements IConfigProvider {
    private cachedCounts?;
    private lastScan;
    private readonly cacheInterval;
    /**
     * Get config counts with hybrid caching
     * Scans filesystem if cache is stale (>5 seconds)
     */
    getConfigs(options?: ConfigScanOptions): Promise<ConfigCounts>;
    /**
     * Scan filesystem for Claude Code configurations
     */
    private scanConfigs;
    /**
     * Check if file exists
     */
    private fileExists;
    /**
     * Read and parse JSON file
     */
    private readJsonFile;
    /**
     * Count MCP servers in config object
     */
    private countMcpServers;
    /**
     * Count hooks in config object
     */
    private countHooks;
    /**
     * Recursively count .md files in directory
     */
    private countRulesInDir;
}
//# sourceMappingURL=config-provider.d.ts.map