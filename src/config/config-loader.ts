/**
 * Config loader for main CLI
 * Loads widget configuration from ~/.claude-scope/config.json
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { ensureDefaultConfig } from "./default-config-generator.js";

/**
 * Individual widget configuration from loaded config
 */
export interface LoadedWidgetConfig {
  /** Widget identifier (e.g., "model", "git", "context") */
  id: string;
  /** Display style (balanced, playful, compact, etc.) */
  style: string;
  /** Widget-specific colors (ANSI escape sequences or color names) */
  colors: Record<string, string>;
}

/**
 * Loaded configuration structure
 * Contains only the lines object, not the full ScopeConfig
 */
export interface LoadedConfig {
  /** Line-based widget configuration */
  lines: Record<string, LoadedWidgetConfig[]>;
}

/**
 * Get config file path
 * @returns Path to ~/.claude-scope/config.json, or CLAUDE_SCOPE_CONFIG env var if set
 */
function getConfigPath(): string {
  // Allow overriding config path via environment variable for testing
  if (process.env.CLAUDE_SCOPE_CONFIG) {
    return process.env.CLAUDE_SCOPE_CONFIG;
  }
  return join(homedir(), ".claude-scope", "config.json");
}

/**
 * Load widget configuration from file system
 * Extracts only the `lines` object for main CLI use
 * @returns Config object with lines, or null if not exists/invalid
 */
export async function loadWidgetConfig(): Promise<LoadedConfig | null> {
  const configPath = getConfigPath();

  // Ensure default config exists before loading
  await ensureDefaultConfig();

  // Check if file exists (should exist now after ensureDefaultConfig)
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
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Config error loading ${configPath}: ${errorMsg}`);
    return null;
  }
}
