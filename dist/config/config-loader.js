/**
 * Config loader for main CLI
 * Loads widget configuration from ~/.claude-scope/config.json
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
/**
 * Get config file path
 * @returns Path to ~/.claude-scope/config.json
 */
function getConfigPath() {
    return join(homedir(), ".claude-scope", "config.json");
}
/**
 * Load widget configuration from file system
 * Extracts only the `lines` object for main CLI use
 * @returns Config object with lines, or null if not exists/invalid
 */
export async function loadWidgetConfig() {
    const configPath = getConfigPath();
    // Check if file exists
    if (!existsSync(configPath)) {
        return null;
    }
    try {
        const content = await readFile(configPath, "utf-8");
        const config = JSON.parse(content);
        // Validate that config has lines object
        if (!config || typeof config !== "object" || !config.lines) {
            return null;
        }
        // Extract only the lines object (ignore version field)
        return {
            lines: config.lines,
        };
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.warn(`Config error loading ${configPath}: ${errorMsg}`);
        return null;
    }
}
//# sourceMappingURL=config-loader.js.map