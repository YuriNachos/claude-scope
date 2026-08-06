import assert from "node:assert";
import { execSync } from "node:child_process";
import { chmod, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { loadWidgetConfig } from "../../../src/config/config-loader.js";
import { quarantineConfig } from "../../../src/config/config-quarantine.js";
import { WidgetFactory } from "../../../src/core/widget-factory.js";

// `os.homedir()` ignores `HOME` on Windows, so isolation must go through
// `CLAUDE_SCOPE_HOME` (src/config/paths.ts) instead of overriding HOME - a
// real temp dir from `mkdtemp`, never a hard-coded `/tmp/...` literal (not a
// real path on Windows).
let testConfigDir: string;

// The real widget ids the factory can build. Passing this (instead of a
// hand-picked subset) means the default layout `ensureDefaultConfig()`
// writes validates with zero problems, matching production.
const KNOWN_WIDGET_IDS = new WidgetFactory().getSupportedWidgetIds();

async function backupFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  return entries.filter((name) => name.startsWith("config.invalid-") && name.endsWith(".json"));
}

describe("ConfigLoader (Main CLI)", () => {
  const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;

  before(async () => {
    testConfigDir = await mkdtemp(join(tmpdir(), "claude-scope-main-cli-"));
    process.env.CLAUDE_SCOPE_HOME = testConfigDir;
  });

  after(async () => {
    // Clean up test directory
    await rm(testConfigDir, { recursive: true, force: true });

    // Restore original override
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
  });

  describe("loadWidgetConfig", () => {
    it("should create default config when config does not exist", async () => {
      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);
      // Config is now created by ensureDefaultConfig()
      assert.ok(result.config);
      assert.ok(result.config.lines);
      assert.strictEqual(result.source, "user");
      assert.strictEqual(result.problems.length, 0);
    });

    it("should load valid config file and extract lines", async () => {
      const validConfig = {
        version: "1.0.0",
        lines: {
          "0": [
            {
              id: "model",
              style: "balanced",
              colors: { name: "[38;2;148;163;184m", version: "" },
            },
          ],
        },
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(validConfig));

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);
      assert.strictEqual(result.source, "user");
      assert.strictEqual(result.problems.length, 0);
      assert.ok(result.config.lines["0"]);
      assert.strictEqual(result.config.lines["0"][0].id, "model");
      assert.strictEqual(result.config.lines["0"][0].style, "balanced");
    });

    it("leaves a valid config file byte-identical on disk after loading (anti-clobber guarantee)", async () => {
      // Named breakage: loadWidgetConfig()/validateConfig() being changed to
      // re-serialise a valid file back to disk (e.g. "normalise" it on every
      // load) would silently rewrite whatever the user wrote - comments,
      // formatting, key order - even though nothing was wrong with it.
      const validConfig = {
        lines: {
          "0": [{ id: "model", style: "balanced", colors: { name: "x" } }],
        },
      };
      const raw = JSON.stringify(validConfig, null, 2);
      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, raw);

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);

      assert.strictEqual(result.source, "user");
      assert.strictEqual(result.problems.length, 0);
      assert.strictEqual(result.quarantinedTo, undefined);

      const onDisk = await readFile(testConfigPath, "utf-8");
      assert.strictEqual(onDisk, raw, "a valid config must be left byte-identical on disk");
      assert.strictEqual(
        (await backupFiles(testConfigDir)).length,
        0,
        "a valid config must never be quarantined"
      );
    });

    it("quarantines corrupt JSON and heals with a fresh default", async () => {
      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, "{invalid json");

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);

      assert.strictEqual(result.source, "healed");
      assert.ok(result.problems.length > 0);
      assert.ok(result.quarantinedTo, "quarantinedTo should be set");
      assert.match(
        result.quarantinedTo as string,
        /config\.invalid-\d{8}T\d{6}Z-[0-9a-f]{8}\.json$/
      );
      assert.ok(Object.keys(result.config.lines).length > 0);

      // A fresh, parseable default now sits at the original path.
      const onDisk = await readFile(testConfigPath, "utf-8");
      assert.doesNotThrow(() => JSON.parse(onDisk));
    });

    it("should heal a config missing lines", async () => {
      const invalidConfig = {
        version: "1.0.0",
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(invalidConfig));

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);
      assert.strictEqual(result.source, "healed");
      assert.ok(result.problems.length > 0);
      assert.ok(Object.keys(result.config.lines).length > 0);
    });

    it("should load config with multiple lines", async () => {
      const multiLineConfig = {
        version: "1.0.0",
        lines: {
          "0": [
            {
              id: "model",
              style: "balanced",
              colors: { name: "test", version: "" },
            },
          ],
          "1": [
            {
              id: "git-tag",
              style: "compact",
              colors: { base: "test" },
            },
          ],
        },
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(multiLineConfig));

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);
      assert.strictEqual(result.source, "user");
      assert.ok(result.config.lines["0"]);
      assert.ok(result.config.lines["1"]);
      assert.strictEqual(result.config.lines["0"][0].id, "model");
      assert.strictEqual(result.config.lines["1"][0].id, "git-tag");
    });

    it("should ignore version field and only return lines", async () => {
      const configWithVersion = {
        version: "1.0.0",
        lines: {
          "0": [
            {
              id: "context",
              style: "playful",
              colors: { low: "test", medium: "", high: "", bar: "" },
            },
          ],
        },
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(configWithVersion));

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);
      assert.ok(result.config);
      assert.ok("lines" in result.config);
      assert.ok(!("version" in result.config));
    });

    it("should load config with multiple widgets per line", async () => {
      const multiWidgetConfig = {
        version: "1.0.0",
        lines: {
          "0": [
            {
              id: "model",
              style: "balanced",
              colors: { name: "test1", version: "" },
            },
            {
              id: "context",
              style: "compact",
              colors: { low: "test2", medium: "", high: "", bar: "" },
            },
          ],
        },
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(multiWidgetConfig));

      const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);
      assert.ok(result.config);
      assert.strictEqual(result.config.lines["0"].length, 2);
      assert.strictEqual(result.config.lines["0"][0].id, "model");
      assert.strictEqual(result.config.lines["0"][1].id, "context");
    });

    describe("when the quarantine rename fails", () => {
      it("falls back to source 'default', never throws, and leaves the corrupt file untouched", async () => {
        const dir = await mkdtemp(join(tmpdir(), "claude-scope-rename-fail-"));
        const previousHome = process.env.CLAUDE_SCOPE_HOME;
        process.env.CLAUDE_SCOPE_HOME = dir;

        const configPath = join(dir, "config.json");
        const corrupt = "{not valid json";
        await writeFile(configPath, corrupt);

        const denyWrite = async () => {
          if (process.platform === "win32") {
            // Deny delete/rename rights only (not plain "W" - that also blocks
            // reads of files inside the directory on Windows, which would make
            // loadWidgetConfig fail earlier at readFile() instead of at rename().
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
          const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);

          assert.strictEqual(result.source, "default");
          assert.strictEqual(result.quarantinedTo, undefined);
          assert.ok(Object.keys(result.config.lines).length > 0);
          assert.ok(
            result.problems.some((p) => /not writable/.test(p.message)),
            "should report why the broken config could not be replaced"
          );
        } finally {
          await restoreWrite();
          const onDisk = await readFile(configPath, "utf-8");
          assert.strictEqual(
            onDisk,
            corrupt,
            "the corrupt file must be left untouched when the rename fails"
          );

          if (previousHome === undefined) {
            delete process.env.CLAUDE_SCOPE_HOME;
          } else {
            process.env.CLAUDE_SCOPE_HOME = previousHome;
          }
          await rm(dir, { recursive: true, force: true });
        }
      });
    });

    describe("when the quarantine backup limit is reached", () => {
      it("leaves the broken config byte-identical and reports why it could not be replaced", async () => {
        const dir = await mkdtemp(join(tmpdir(), "claude-scope-quarantine-limit-"));
        const previousHome = process.env.CLAUDE_SCOPE_HOME;
        process.env.CLAUDE_SCOPE_HOME = dir;
        const configPath = join(dir, "config.json");

        try {
          // Fill up the 5 backup slots with 5 distinct broken configs first.
          for (let i = 0; i < 5; i++) {
            const content = `{seed-${i}`;
            await writeFile(configPath, content);
            const outcome = await quarantineConfig(
              configPath,
              content,
              new Date("2026-01-01T00:00:00Z")
            );
            assert.ok(outcome.quarantinedTo, `seed backup ${i} should have been created`);
          }
          assert.strictEqual((await backupFiles(dir)).length, 5);

          const corrupt = "{not valid json, and the backup limit is full";
          await writeFile(configPath, corrupt);

          const result = await loadWidgetConfig(KNOWN_WIDGET_IDS);

          assert.strictEqual(result.source, "default");
          assert.strictEqual(result.quarantinedTo, undefined);
          assert.ok(
            result.problems.some((p) => /too many saved copies/.test(p.message)),
            "should report why the broken config could not be replaced"
          );

          const onDisk = await readFile(configPath, "utf-8");
          assert.strictEqual(
            onDisk,
            corrupt,
            "the broken config must be left byte-identical when it cannot be backed up"
          );
        } finally {
          if (previousHome === undefined) {
            delete process.env.CLAUDE_SCOPE_HOME;
          } else {
            process.env.CLAUDE_SCOPE_HOME = previousHome;
          }
          await rm(dir, { recursive: true, force: true });
        }
      });
    });
  });
});
