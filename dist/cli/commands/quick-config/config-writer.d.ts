/**
 * Config writer
 * Saves configuration to ~/.claude-scope/config.json
 */
import type { ScopeConfig } from "./config-schema.js";
/**
 * Save configuration to file system (overwrites existing)
 * @throws Error if write fails (permission, disk space, etc.)
 */
export declare function saveConfig(config: ScopeConfig): Promise<void>;
//# sourceMappingURL=config-writer.d.ts.map