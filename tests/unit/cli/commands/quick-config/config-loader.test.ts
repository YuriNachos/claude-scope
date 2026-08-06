import assert from "node:assert";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import {
  getUserConfigDir,
  getUserConfigPath,
  loadConfig,
} from "../../../../../src/cli/commands/quick-config/config-loader.js";

// `os.homedir()` ignores `HOME` on Windows, so isolation must go through
// `CLAUDE_SCOPE_HOME` (src/config/paths.ts) instead of overriding HOME - a
// real temp dir from `mkdtemp`, never a hard-coded `/tmp/...` literal (not a
// real path on Windows). `CLAUDE_SCOPE_HOME` *is* the resolved config dir
// (no nested `.claude-scope` segment is appended).
let testConfigDir: string;

describe("ConfigLoader", () => {
  const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;

  before(async () => {
    testConfigDir = await mkdtemp(join(tmpdir(), "claude-scope-quick-config-"));
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

  describe("getUserConfigDir", () => {
    it("should return test config directory path", () => {
      const result = getUserConfigDir();
      assert.strictEqual(result, testConfigDir);
    });
  });

  describe("getUserConfigPath", () => {
    it("should return test config.json path", () => {
      const result = getUserConfigPath();
      assert.strictEqual(result, join(testConfigDir, "config.json"));
    });
  });

  describe("loadConfig", () => {
    it("should return null when config does not exist", async () => {
      const config = await loadConfig();
      assert.strictEqual(config, null);
    });

    it("should load valid config file", async () => {
      const validConfig = {
        version: "1.0.0",
        lines: {
          "0": [
            {
              id: "model",
              style: "balanced",
              colors: { name: "\u001b[38;2;148;163;184m", version: "" },
            },
          ],
        },
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(validConfig));

      const config = await loadConfig();
      assert.deepStrictEqual(config, validConfig);
    });

    it("should return null for corrupt JSON", async () => {
      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, "{invalid json");

      const config = await loadConfig();
      assert.strictEqual(config, null);
    });

    it("should return null for config missing version", async () => {
      const invalidConfig = {
        lines: {
          "0": [
            {
              id: "model",
              style: "balanced",
            },
          ],
        },
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(invalidConfig));

      const config = await loadConfig();
      assert.strictEqual(config, null);
    });

    it("should return null for config missing lines", async () => {
      const invalidConfig = {
        version: "1.0.0",
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(invalidConfig));

      const config = await loadConfig();
      assert.strictEqual(config, null);
    });
  });
});
