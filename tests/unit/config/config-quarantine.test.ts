import assert from "node:assert";
import { execSync } from "node:child_process";
import { chmod, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { quarantineConfig } from "../../../src/config/config-quarantine.js";

// quarantineConfig()'s regenerate() step writes the default config through
// getConfigPath() (src/config/paths.ts), which only honours
// CLAUDE_SCOPE_HOME/CLAUDE_SCOPE_CONFIG - never HOME. Isolation must go
// through that override, and configPath must resolve inside the same
// directory or regenerate() would write into the real ~/.claude-scope.
describe("quarantineConfig", () => {
  const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
  let dir: string;
  let configPath: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "claude-scope-quarantine-"));
    process.env.CLAUDE_SCOPE_HOME = dir;
    configPath = join(dir, "config.json");
  });

  afterEach(async () => {
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
    await rm(dir, { recursive: true, force: true });
  });

  async function backupFiles(): Promise<string[]> {
    const entries = await readdir(dir);
    return entries.filter((name) => name.startsWith("config.invalid-") && name.endsWith(".json"));
  }

  it("renames the broken file to config.invalid-<timestamp>-<hash>.json and regenerates the default", async () => {
    await writeFile(configPath, "{not valid json");
    const timestamp = new Date("2026-03-04T10:15:30.123Z");

    const outcome = await quarantineConfig(configPath, "{not valid json", timestamp);

    assert.ok(outcome.quarantinedTo);
    assert.match(
      outcome.quarantinedTo as string,
      /config\.invalid-20260304T101530Z-[0-9a-f]{8}\.json$/
    );
    assert.strictEqual((await backupFiles()).length, 1);

    const regenerated = await readFile(configPath, "utf-8");
    assert.doesNotThrow(() => JSON.parse(regenerated), "a fresh default must sit at the old path");
  });

  it("quarantines the same corrupt bytes exactly once no matter how many times it is loaded", async () => {
    const corrupt = "{same corrupt bytes";
    await writeFile(configPath, corrupt);
    const timestamp = new Date("2026-01-01T00:00:00Z");

    const first = await quarantineConfig(configPath, corrupt, timestamp);
    assert.ok(first.quarantinedTo);
    assert.strictEqual(first.healed, true);

    // The same broken bytes show up at the config path again. These exact
    // bytes already have a backup, so no second one is written - but the
    // config path itself must still be healed each time.
    await writeFile(configPath, corrupt);
    const second = await quarantineConfig(configPath, corrupt, timestamp);
    assert.strictEqual(second.quarantinedTo, null);
    assert.strictEqual(second.reason, undefined);
    assert.strictEqual(second.healed, true);

    await writeFile(configPath, corrupt);
    const third = await quarantineConfig(configPath, corrupt, timestamp);
    assert.strictEqual(third.quarantinedTo, null);
    assert.strictEqual(third.healed, true);

    assert.strictEqual((await backupFiles()).length, 1);
  });

  it("replaces the broken config with a fresh default on repeat corruption of the same bytes (regression: used to leave the config stuck broken forever)", async () => {
    // Named breakage: the dedupe branch ("these bytes already have a backup")
    // used to skip the replacement entirely and call the old regenerate(),
    // which no-ops when a file already exists at the config path - so the
    // broken file sat there, was re-read and re-reported on every render, and
    // could never heal. It must now always replace the file with a fresh
    // default, since the broken bytes are provably already saved.
    const corrupt = "{same corrupt bytes, again";
    const timestamp = new Date("2026-01-01T00:00:00Z");

    await writeFile(configPath, corrupt);
    const first = await quarantineConfig(configPath, corrupt, timestamp);
    assert.ok(first.quarantinedTo);
    assert.strictEqual(first.healed, true);

    await writeFile(configPath, corrupt);
    const second = await quarantineConfig(configPath, corrupt, timestamp);

    assert.strictEqual(second.quarantinedTo, null, "no second backup for the same bytes");
    assert.strictEqual(
      second.healed,
      true,
      "REGRESSION: must still replace the broken file, not leave it stuck"
    );
    assert.strictEqual(
      (await backupFiles()).length,
      1,
      "still exactly one backup for this content"
    );

    const onDisk = await readFile(configPath, "utf-8");
    assert.doesNotThrow(
      () => JSON.parse(onDisk),
      "the config path must hold a fresh valid default, not the stuck corrupt bytes"
    );
  });

  it("quarantines two different corrupt contents into two separate backups", async () => {
    const timestamp = new Date("2026-01-01T00:00:00Z");

    await writeFile(configPath, "{content A");
    const a = await quarantineConfig(configPath, "{content A", timestamp);
    assert.ok(a.quarantinedTo);

    await writeFile(configPath, "{content B");
    const b = await quarantineConfig(configPath, "{content B", timestamp);
    assert.ok(b.quarantinedTo);

    assert.notStrictEqual(a.quarantinedTo, b.quarantinedTo);
    assert.strictEqual((await backupFiles()).length, 2);
  });

  it("stops renaming once MAX_QUARANTINE_FILES (5) backups exist, without deleting any", async () => {
    const timestamp = new Date("2026-01-01T00:00:00Z");
    for (let i = 0; i < 5; i++) {
      const content = `{content-${i}`;
      await writeFile(configPath, content);
      const outcome = await quarantineConfig(configPath, content, timestamp);
      assert.ok(outcome.quarantinedTo, `expected backup ${i} to be created`);
    }
    assert.strictEqual((await backupFiles()).length, 5);

    const sixthContent = "{content-6";
    await writeFile(configPath, sixthContent);
    const sixth = await quarantineConfig(configPath, sixthContent, timestamp);

    assert.strictEqual(sixth.quarantinedTo, null);
    assert.strictEqual(sixth.healed, false);
    assert.strictEqual(sixth.reason, "limit-reached");
    assert.strictEqual((await backupFiles()).length, 5, "no backup file should be deleted");

    const onDisk = await readFile(configPath, "utf-8");
    assert.strictEqual(
      onDisk,
      sixthContent,
      "the 6th corrupt file is left in place at the config path, not renamed"
    );
  });

  it("does not overwrite the original when the rename fails", async () => {
    const corrupt = "{cannot rename me";
    await writeFile(configPath, corrupt);

    const denyWrite = async () => {
      if (process.platform === "win32") {
        // Deny delete/rename rights only (not plain "W" - that also blocks reads
        // of files inside the directory on Windows, which is not what we're
        // simulating here).
        execSync(`icacls "${dir}" /deny "%USERNAME%:(OI)(CI)(DE,DC)"`, { stdio: "pipe" });
      } else {
        await chmod(dir, 0o500);
      }
    };
    const restoreWrite = async () => {
      if (process.platform === "win32") {
        execSync(`icacls "${dir}" /remove:d "%USERNAME%"`, { stdio: "pipe" });
      } else {
        await chmod(dir, 0o700);
      }
    };

    await denyWrite();
    try {
      const outcome = await quarantineConfig(configPath, corrupt, new Date());

      assert.strictEqual(outcome.quarantinedTo, null);
      assert.strictEqual(outcome.healed, false);
      assert.strictEqual(outcome.reason, "rename-failed");
    } finally {
      await restoreWrite();
    }

    const onDisk = await readFile(configPath, "utf-8");
    assert.strictEqual(onDisk, corrupt, "the original file must be left untouched");
  });
});
