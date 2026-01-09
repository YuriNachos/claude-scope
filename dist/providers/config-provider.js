/**
 * Config Provider
 *
 * Scans Claude Code configuration files with hybrid caching.
 * Cache invalidates after 5 seconds.
 */
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
/**
 * Provider for scanning Claude Code configuration with caching
 */
export class ConfigProvider {
    cachedCounts;
    lastScan = 0;
    cacheInterval = 5000; // 5 seconds
    /**
     * Get config counts with hybrid caching
     * Scans filesystem if cache is stale (>5 seconds)
     */
    async getConfigs(options = {}) {
        const now = Date.now();
        // Return cache if fresh
        if (this.cachedCounts && now - this.lastScan < this.cacheInterval) {
            return this.cachedCounts;
        }
        // Scan and update cache
        this.cachedCounts = await this.scanConfigs(options);
        this.lastScan = now;
        return this.cachedCounts;
    }
    /**
     * Scan filesystem for Claude Code configurations
     */
    async scanConfigs(options) {
        let claudeMdCount = 0;
        let rulesCount = 0;
        let mcpCount = 0;
        let hooksCount = 0;
        const homeDir = os.homedir();
        const claudeDir = path.join(homeDir, ".claude");
        const cwd = options.cwd;
        // === USER SCOPE ===
        // ~/.claude/CLAUDE.md
        if (await this.fileExists(path.join(claudeDir, "CLAUDE.md"))) {
            claudeMdCount++;
        }
        // ~/.claude/rules/*.md
        rulesCount += await this.countRulesInDir(path.join(claudeDir, "rules"));
        // ~/.claude/settings.json
        const userSettings = path.join(claudeDir, "settings.json");
        const userSettingsData = await this.readJsonFile(userSettings);
        if (userSettingsData) {
            mcpCount += this.countMcpServers(userSettingsData);
            hooksCount += this.countHooks(userSettingsData);
        }
        // ~/.claude.json
        const userClaudeJson = path.join(homeDir, ".claude.json");
        const userClaudeData = await this.readJsonFile(userClaudeJson);
        if (userClaudeData) {
            // Dedupe: subtract MCPs already counted in settings.json
            const userMcpCount = this.countMcpServers(userClaudeData);
            mcpCount += Math.max(0, userMcpCount - this.countMcpServers(userSettingsData || {}));
        }
        // === PROJECT SCOPE ===
        if (cwd) {
            // {cwd}/CLAUDE.md
            if (await this.fileExists(path.join(cwd, "CLAUDE.md"))) {
                claudeMdCount++;
            }
            // {cwd}/CLAUDE.local.md
            if (await this.fileExists(path.join(cwd, "CLAUDE.local.md"))) {
                claudeMdCount++;
            }
            // {cwd}/.claude/CLAUDE.md
            if (await this.fileExists(path.join(cwd, ".claude", "CLAUDE.md"))) {
                claudeMdCount++;
            }
            // {cwd}/.claude/CLAUDE.local.md
            if (await this.fileExists(path.join(cwd, ".claude", "CLAUDE.local.md"))) {
                claudeMdCount++;
            }
            // {cwd}/.claude/rules/*.md
            rulesCount += await this.countRulesInDir(path.join(cwd, ".claude", "rules"));
            // {cwd}/.mcp.json
            const mcpJson = path.join(cwd, ".mcp.json");
            const mcpData = await this.readJsonFile(mcpJson);
            if (mcpData) {
                mcpCount += this.countMcpServers(mcpData);
            }
            // {cwd}/.claude/settings.json
            const projectSettings = path.join(cwd, ".claude", "settings.json");
            const projectSettingsData = await this.readJsonFile(projectSettings);
            if (projectSettingsData) {
                mcpCount += this.countMcpServers(projectSettingsData);
                hooksCount += this.countHooks(projectSettingsData);
            }
            // {cwd}/.claude/settings.local.json
            const localSettings = path.join(cwd, ".claude", "settings.local.json");
            const localSettingsData = await this.readJsonFile(localSettings);
            if (localSettingsData) {
                mcpCount += this.countMcpServers(localSettingsData);
                hooksCount += this.countHooks(localSettingsData);
            }
        }
        return { claudeMdCount, rulesCount, mcpCount, hooksCount };
    }
    /**
     * Check if file exists
     */
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Read and parse JSON file
     */
    async readJsonFile(filePath) {
        try {
            const content = await fs.readFile(filePath, "utf8");
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    /**
     * Count MCP servers in config object
     */
    countMcpServers(config) {
        if (!config || !config.mcpServers || typeof config.mcpServers !== "object") {
            return 0;
        }
        return Object.keys(config.mcpServers).length;
    }
    /**
     * Count hooks in config object
     */
    countHooks(config) {
        if (!config || !config.hooks || typeof config.hooks !== "object") {
            return 0;
        }
        return Object.keys(config.hooks).length;
    }
    /**
     * Recursively count .md files in directory
     */
    async countRulesInDir(rulesDir) {
        const exists = await this.fileExists(rulesDir);
        if (!exists)
            return 0;
        try {
            let count = 0;
            const entries = await fs.readdir(rulesDir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(rulesDir, entry.name);
                if (entry.isDirectory()) {
                    count += await this.countRulesInDir(fullPath);
                }
                else if (entry.isFile() && entry.name.endsWith(".md")) {
                    count++;
                }
            }
            return count;
        }
        catch {
            return 0;
        }
    }
}
//# sourceMappingURL=config-provider.js.map