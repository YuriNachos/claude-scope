/**
 * Config loader for main CLI
 * Loads widget configuration from ~/.claude-scope/config.json
 */

import { readFile } from "node:fs/promises";
import { DEFAULT_WIDGET_STYLE } from "../core/style-types.js";
import { quarantineConfig } from "./config-quarantine.js";
import { type ConfigProblem, validateConfig } from "./config-validator.js";
import { buildDefaultConfig, ensureDefaultConfig } from "./default-config-generator.js";
import { getConfigPath } from "./paths.js";

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
 * Contains lines and theme from config
 */
export interface LoadedConfig {
  /** Line-based widget configuration */
  lines: Record<string, LoadedWidgetConfig[]>;
  /** Theme name (e.g., "monokai", "catppuccin-mocha") */
  theme?: string;
}

/**
 * Where the config that ended up being used came from
 *
 * - `user` - the config file, as written
 * - `repaired` - the config file with invalid entries dropped
 * - `healed` - the file was unusable, so it was quarantined and replaced
 * - `default` - the file was unusable AND could not be replaced on disk
 */
export type ConfigSource = "user" | "repaired" | "healed" | "default";

/**
 * Outcome of loading the config
 */
export interface ConfigLoadResult {
  /** Config to render with - always usable */
  config: LoadedConfig;
  /** Where that config came from */
  source: ConfigSource;
  /** Everything found wrong with the user's config */
  problems: ConfigProblem[];
  /** Path the unusable config was saved to, when it was replaced */
  quarantinedTo?: string;
}

/**
 * Load widget configuration from the file system
 *
 * Never returns null and never throws: an unreadable, corrupt or unusable
 * config is quarantined and replaced with the default, so the statusline keeps
 * working instead of silently degrading to a hardcoded widget set.
 *
 * @param knownWidgetIds - Widget ids the factory can build; entries naming
 *   anything else are dropped and reported
 */
export async function loadWidgetConfig(
  knownWidgetIds: readonly string[]
): Promise<ConfigLoadResult> {
  const configPath = getConfigPath();

  // Ensure default config exists before loading
  await ensureDefaultConfig();

  let content: string;
  try {
    content = await readFile(configPath, "utf-8");
  } catch {
    // Nothing readable on disk (missing directory, unwritable home). Render
    // from the in-memory default rather than showing nothing.
    return { config: defaultConfig(), source: "default", problems: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return heal(configPath, content, [{ path: [], message, value: undefined }]);
  }

  const validation = validateConfig(parsed, knownWidgetIds);

  if (validation.outcome === "unrecoverable") {
    return heal(configPath, content, validation.problems);
  }

  return {
    config: validation.config,
    source: validation.outcome === "valid" ? "user" : "repaired",
    problems: validation.problems,
  };
}

/**
 * Quarantine an unusable config and load the default that replaces it
 */
async function heal(
  configPath: string,
  rawBytes: string,
  problems: ConfigProblem[]
): Promise<ConfigLoadResult> {
  const outcome = await quarantineConfig(configPath, rawBytes);

  if (!outcome.healed) {
    // The config is still broken on disk and will be again next render, so say
    // why rather than leaving the user with a notice that never clears.
    problems.push({
      path: [],
      message:
        outcome.reason === "limit-reached"
          ? "Config could not be replaced: too many saved copies already, remove some config.invalid-*.json"
          : "Config could not be replaced: the config directory is not writable",
      value: configPath,
    });
  }

  const result: ConfigLoadResult = {
    // Same layout the generator writes to disk, so the rendered statusline
    // matches the file even when that write failed.
    config: defaultConfig(),
    source: outcome.healed ? "healed" : "default",
    problems,
  };

  if (outcome.quarantinedTo) {
    result.quarantinedTo = outcome.quarantinedTo;
  }

  return result;
}

/**
 * The default layout, in the shape the renderer consumes
 */
function defaultConfig(): LoadedConfig {
  const { lines, theme } = buildDefaultConfig();

  // The shipped default is authored in code, so it is normalised rather than
  // validated - running it through validateConfig would silently drop entries
  // on the one path that has to work.
  const normalized: Record<string, LoadedWidgetConfig[]> = {};
  for (const [line, widgets] of Object.entries(lines)) {
    normalized[line] = widgets.map((widget) => ({
      id: widget.id,
      style: widget.style ?? DEFAULT_WIDGET_STYLE,
      // Each widget declares its own color keys; flattened to the open map the
      // renderer takes.
      colors: Object.fromEntries(Object.entries(widget.colors ?? {})),
    }));
  }

  return { lines: normalized, theme };
}
