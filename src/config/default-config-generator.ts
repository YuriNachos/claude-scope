/**
 * Default config generator
 * Ensures default config exists on first install
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { generateRichLayout } from "./default-config.js";
import { getConfigPath } from "./paths.js";

/**
 * Get the default config file path
 * @returns Resolved config path (see `getConfigPath`)
 */
export function getDefaultConfigPath(): string {
  return getConfigPath();
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

  // Create the containing directory if it doesn't exist. Derived from the
  // resolved config path, which an override may place outside the config dir.
  const configDir = dirname(configPath);
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  // Generate default config: rich layout, balanced style, monokai theme
  const defaultConfig = generateRichLayout("balanced", "monokai");

  // Write config file
  writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf-8");
}
