/**
 * Default config generator
 * Ensures default config exists on first install
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { generateRichLayout } from "./default-config.js";

/**
 * Get the default config file path
 * @returns Path to ~/.claude-scope/config.json
 */
export function getDefaultConfigPath(): string {
  return join(homedir(), ".claude-scope", "config.json");
}

/**
 * Ensure default config exists
 * Creates default config if it doesn't exist
 * Does NOT overwrite existing config
 */
export async function ensureDefaultConfig(): Promise<void> {
  const configPath = getDefaultConfigPath();

  // If config already exists, do nothing
  if (existsSync(configPath)) {
    return;
  }

  // Create .claude-scope directory if it doesn't exist
  const configDir = join(homedir(), ".claude-scope");
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  // Generate default config: rich layout, balanced style, dracula theme
  const defaultConfig = generateRichLayout("balanced", "dracula");

  // Write config file
  writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf-8");
}
