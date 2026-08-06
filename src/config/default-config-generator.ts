/**
 * Default config generator
 * Ensures default config exists on first install
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { ScopeConfig } from "../cli/commands/quick-config/config-schema.js";
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
 * The default config: rich layout, balanced style, monokai theme
 *
 * The one definition of "default", so a config written to disk and one built
 * in memory as a fallback cannot drift apart.
 */
export function buildDefaultConfig(): ScopeConfig {
  return generateRichLayout("balanced", "monokai");
}

/**
 * Ensure default config exists
 * Creates default config if it doesn't exist
 * Does NOT overwrite existing config
 */
export async function ensureDefaultConfig(): Promise<void> {
  // If config already exists, do nothing
  if (existsSync(getDefaultConfigPath())) {
    return;
  }

  await writeDefaultConfig();
}

/**
 * Write the default config, replacing whatever is there
 *
 * Only for callers that have already preserved the existing file - the
 * quarantine path, which backs the old config up before calling this.
 */
export async function writeDefaultConfig(): Promise<void> {
  const configPath = getDefaultConfigPath();

  // Create the containing directory if it doesn't exist. Derived from the
  // resolved config path, which an override may place outside the config dir.
  const configDir = dirname(configPath);
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  writeFileSync(configPath, JSON.stringify(buildDefaultConfig(), null, 2), "utf-8");
}
