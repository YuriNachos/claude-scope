/**
 * Single source of truth for every path claude-scope reads or writes
 *
 * The config directory used to be recomputed in four places, only one of which
 * honoured the `CLAUDE_SCOPE_CONFIG` override - so a test or a sandboxed run
 * could read from an overridden path while the default-config generator wrote
 * to the real home directory. All path resolution now goes through this module.
 *
 * Overrides (both optional, useful for tests and sandboxed runs):
 * - `CLAUDE_SCOPE_HOME`  - directory holding config and cache
 * - `CLAUDE_SCOPE_CONFIG` - full path to the config file, wins over the above
 */

import { homedir } from "node:os";
import { dirname, join } from "node:path";

/** Directory name used under the user's home directory */
const CONFIG_DIR_NAME = ".claude-scope";

/** Config file name inside the config directory */
const CONFIG_FILE_NAME = "config.json";

/** Cache file name inside the cache directory */
const CACHE_FILE_NAME = "cache.json";

/** Diagnostics report file name, written next to the config */
const REPORT_FILE_NAME = "config-report.txt";

/**
 * Directory holding the user's config
 *
 * Resolved per call rather than cached, so tests can point the whole app at a
 * temporary directory by setting the environment variable.
 *
 * @returns `$CLAUDE_SCOPE_HOME` if set, otherwise `~/.claude-scope`
 */
export function getConfigDir(): string {
  return process.env.CLAUDE_SCOPE_HOME || join(homedir(), CONFIG_DIR_NAME);
}

/**
 * Full path to the config file
 *
 * @returns `$CLAUDE_SCOPE_CONFIG` if set, otherwise `<config dir>/config.json`
 */
export function getConfigPath(): string {
  return process.env.CLAUDE_SCOPE_CONFIG || join(getConfigDir(), CONFIG_FILE_NAME);
}

/**
 * Full path of the config diagnostics report
 *
 * Sits next to the resolved config file, so an override moves both together.
 */
export function getConfigReportPath(): string {
  return join(dirname(getConfigPath()), REPORT_FILE_NAME);
}

/**
 * Directory holding the widget state cache
 *
 * @returns `$CLAUDE_SCOPE_HOME` if set, otherwise `~/.config/claude-scope`
 */
export function getCacheDir(): string {
  return process.env.CLAUDE_SCOPE_HOME || join(homedir(), ".config", "claude-scope");
}

/**
 * Full path to the cache file
 */
export function getCachePath(): string {
  return join(getCacheDir(), CACHE_FILE_NAME);
}
