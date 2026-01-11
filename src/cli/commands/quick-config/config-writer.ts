/**
 * Config writer
 * Saves configuration to ~/.claude-scope/config.json
 */

import { mkdir, writeFile } from "node:fs/promises";
import { getUserConfigDir, getUserConfigPath } from "./config-loader.js";
import type { ScopeConfig } from "./config-schema.js";

/**
 * Save configuration to file system (overwrites existing)
 * @throws Error if write fails (permission, disk space, etc.)
 */
export async function saveConfig(config: ScopeConfig): Promise<void> {
  const configDir = getUserConfigDir();
  const configPath = getUserConfigPath();

  // Ensure directory exists
  await mkdir(configDir, { recursive: true });

  // Write with formatted JSON
  const json = JSON.stringify(config, null, 2);
  await writeFile(configPath, json, "utf-8");
}
