/**
 * Config loader
 * Loads configuration from ~/.claude-scope/config.json
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
/**
 * Get user config directory path
 */
export function getUserConfigDir() {
    return join(homedir(), ".claude-scope");
}
/**
 * Get user config file path
 */
export function getUserConfigPath() {
    return join(getUserConfigDir(), "config.json");
}
/**
 * Load configuration from file system
 * @returns Config object or null if not exists/invalid
 */
export async function loadConfig() {
    const configPath = getUserConfigPath();
    // Check if file exists
    if (!existsSync(configPath)) {
        return null;
    }
    try {
        const content = await readFile(configPath, "utf-8");
        const config = JSON.parse(content);
        // Basic validation
        if (!config.version || !config.lines) {
            return null;
        }
        return config;
    }
    catch (error) {
        // Corrupt JSON, permission error, etc.
        console.warn(`Config error: ${error instanceof Error ? error.message : "Unknown error"}`);
        return null;
    }
}
//# sourceMappingURL=config-loader.js.map