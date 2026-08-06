import assert from "node:assert";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { loadWidgetConfig } from "../../../src/config/config-loader.js";

// `os.homedir()` ignores `HOME` on Windows, so isolation must go through
// `CLAUDE_SCOPE_HOME` (src/config/paths.ts) instead of overriding HOME - a
// real temp dir from `mkdtemp`, never a hard-coded `/tmp/...` literal (not a
// real path on Windows).
let testConfigDir: string;

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
      const config = await loadWidgetConfig();
      // Config is now created by ensureDefaultConfig()
      assert.ok(config);
      assert.ok(config.lines);
    });

    it("should load valid config file and extract lines", async () => {
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

      const config = await loadWidgetConfig();
      assert.ok(config);
      assert.ok(config.lines["0"]);
      assert.strictEqual(config.lines["0"][0].id, "model");
      assert.strictEqual(config.lines["0"][0].style, "balanced");
    });

    it("should return null for corrupt JSON", async () => {
      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, "{invalid json");

      const config = await loadWidgetConfig();
      assert.strictEqual(config, null);
    });

    it("should return null for config missing lines", async () => {
      const invalidConfig = {
        version: "1.0.0",
      };

      const testConfigPath = join(testConfigDir, "config.json");
      await writeFile(testConfigPath, JSON.stringify(invalidConfig));

      const config = await loadWidgetConfig();
      assert.strictEqual(config, null);
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

      const config = await loadWidgetConfig();
      assert.ok(config);
      assert.ok(config.lines["0"]);
      assert.ok(config.lines["1"]);
      assert.strictEqual(config.lines["0"][0].id, "model");
      assert.strictEqual(config.lines["1"][0].id, "git-tag");
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

      const config = await loadWidgetConfig();
      assert.ok(config);
      assert.ok("lines" in config);
      assert.ok(!("version" in config));
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

      const config = await loadWidgetConfig();
      assert.ok(config);
      assert.strictEqual(config.lines["0"].length, 2);
      assert.strictEqual(config.lines["0"][0].id, "model");
      assert.strictEqual(config.lines["0"][1].id, "context");
    });
  });
});
