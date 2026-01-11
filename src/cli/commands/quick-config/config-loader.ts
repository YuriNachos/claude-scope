/**
 * Config loader
 * Loads configuration from ~/.claude-scope/config.json
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ScopeConfig } from "./config-schema.js";

/**
 * Get user config directory path
 */
export function getUserConfigDir(): string {
  return join(homedir(), ".claude-scope");
}

/**
 * Get user config file path
 */
export function getUserConfigPath(): string {
  return join(getUserConfigDir(), "config.json");
}

/**
 * Load configuration from file system
 * @returns Config object or null if not exists/invalid
 */
export async function loadConfig(): Promise<ScopeConfig | null> {
  const configPath = getUserConfigPath();

  // Check if file exists
  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = await readFile(configPath, "utf-8");
    const config = JSON.parse(content) as ScopeConfig;

    // Basic validation
    if (!config.version || !config.lines) {
      return null;
    }

    return config;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Config error loading ${configPath}: ${errorMsg}`);
    return null;
  }
}
