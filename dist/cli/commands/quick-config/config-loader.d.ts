/**
 * Config loader
 * Loads configuration from ~/.claude-scope/config.json
 */
import type { ScopeConfig } from "./config-schema.js";
/**
 * Get user config directory path
 */
export declare function getUserConfigDir(): string;
/**
 * Get user config file path
 */
export declare function getUserConfigPath(): string;
/**
 * Load configuration from file system
 * @returns Config object or null if not exists/invalid
 */
export declare function loadConfig(): Promise<ScopeConfig | null>;
//# sourceMappingURL=config-loader.d.ts.map