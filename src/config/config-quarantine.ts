/**
 * Config quarantine
 *
 * Moves a config that cannot be used aside and lets the generator write a
 * fresh default in its place, so a broken file heals itself instead of
 * degrading the statusline for good.
 *
 * Two properties matter and are enforced here rather than left to callers:
 * - The original bytes are never destroyed. If the rename fails, nothing is
 *   overwritten either.
 * - The same broken content is quarantined once, not on every render. Backups
 *   are keyed by a content hash, and no more than MAX_QUARANTINE_FILES are kept.
 */

import { createHash } from "node:crypto";
import { readdir, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { writeDefaultConfig } from "./default-config-generator.js";

/** Never accumulate more than this many backups; existing ones are never deleted */
const MAX_QUARANTINE_FILES = 5;

/** Backup file naming: config.invalid-<timestamp>-<hash>.json */
const QUARANTINE_PREFIX = "config.invalid-";

/**
 * What happened to the broken config
 */
export interface QuarantineOutcome {
  /** Path the broken config was saved to; `null` if these bytes were already saved */
  quarantinedTo: string | null;
  /** Whether the broken config was replaced with a fresh default */
  healed: boolean;
  /** Why the config could not be replaced, when `healed` is false */
  reason?: "limit-reached" | "rename-failed";
}

/**
 * Save a broken config aside and replace it with the default
 *
 * Never throws: an unwritable directory leaves the file untouched and is
 * reported through the returned outcome.
 *
 * @param configPath - Path of the config that could not be used
 * @param rawBytes - Its exact contents, used to key the backup
 * @param timestamp - Time used in the backup name, injectable for tests
 */
export async function quarantineConfig(
  configPath: string,
  rawBytes: string,
  timestamp: Date = new Date()
): Promise<QuarantineOutcome> {
  const dir = dirname(configPath);
  const hash = createHash("sha256").update(rawBytes).digest("hex").slice(0, 8);

  const existing = await listQuarantineFiles(dir);

  // These exact bytes already have a backup, so nothing is lost by replacing
  // them. Skipping the replacement instead would leave the config broken for
  // good, re-read and re-reported on every render.
  if (existing.some((name) => name.endsWith(`-${hash}.json`))) {
    return { quarantinedTo: null, healed: await replaceWithDefault() };
  }

  if (existing.length >= MAX_QUARANTINE_FILES) {
    // Unsaved content and nowhere to save it. Replacing would destroy it, so
    // the config stays as it is and the caller reports why.
    return { quarantinedTo: null, healed: false, reason: "limit-reached" };
  }

  const target = join(dir, `${QUARANTINE_PREFIX}${formatTimestamp(timestamp)}-${hash}.json`);

  try {
    await rename(configPath, target);
  } catch {
    // Read-only directory, permissions, or a locked file. Leave everything
    // alone rather than overwriting a config we failed to back up.
    return { quarantinedTo: null, healed: false, reason: "rename-failed" };
  }

  return { quarantinedTo: target, healed: await replaceWithDefault() };
}

/**
 * Write the default config over whatever is at the config path
 *
 * @returns Whether the write succeeded; a failure self-corrects on the next run
 */
async function replaceWithDefault(): Promise<boolean> {
  try {
    await writeDefaultConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * List existing quarantine files in the config directory
 */
async function listQuarantineFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir);
    return entries.filter((name) => name.startsWith(QUARANTINE_PREFIX) && name.endsWith(".json"));
  } catch {
    return [];
  }
}

/**
 * Compact ISO timestamp for file names: 20260806T101500Z
 */
function formatTimestamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+Z$/, "Z");
}
