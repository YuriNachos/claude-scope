// tests/unit/config/default-config-generator.test.ts
import assert from "node:assert";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  ensureDefaultConfig,
  getDefaultConfigPath,
} from "../../../src/config/default-config-generator.js";

describe("DefaultConfigGenerator", () => {
  describe("ensureDefaultConfig", () => {
    // These tests write a real config file. `getDefaultConfigPath()` resolves
    // through `os.homedir()` to the REAL `~/.claude-scope/config.json`
    // (src/config/paths.ts) unless overridden, so point `CLAUDE_SCOPE_HOME`
    // at a temp dir for every test in this block - the suite must never
    // touch the developer's real config directory.
    const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
    let scopeHomeDir: string;
    let configPath: string;

    beforeEach(async () => {
      scopeHomeDir = await mkdtemp(join(tmpdir(), "claude-scope-default-config-"));
      process.env.CLAUDE_SCOPE_HOME = scopeHomeDir;
      configPath = getDefaultConfigPath();
    });

    afterEach(async () => {
      if (originalScopeHome === undefined) {
        delete process.env.CLAUDE_SCOPE_HOME;
      } else {
        process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
      }
      await rm(scopeHomeDir, { recursive: true, force: true });
    });

    it("creates config with rich layout, balanced style, monokai theme", async () => {
      // Ensure default config exists
      await ensureDefaultConfig();

      // Verify file was created
      assert(existsSync(configPath), "Config file should exist");

      // Read and verify content
      const content = JSON.parse(await readFile(configPath, "utf-8"));

      assert.strictEqual(content.version, "1.0.0");
      assert(content.lines["0"], "Line 0 should exist");
      assert(content.lines["1"], "Line 1 should exist");

      // Check balanced layout widgets
      const line0Ids = content.lines["0"].map((w: any) => w.id);
      assert(line0Ids.includes("model"), "model should be on line 0");
      assert(line0Ids.includes("context"), "context should be on line 0");
      assert(line0Ids.includes("cost"), "cost should be on line 0");
      assert(line0Ids.includes("duration"), "duration should be on line 0");
      assert(line0Ids.includes("lines"), "lines should be on line 0");

      // Check style is balanced
      content.lines["0"].forEach((w: any) => {
        assert.strictEqual(w.style, "balanced");
      });

      // Check theme colors are present (monokai theme)
      const modelWidget = content.lines["0"].find((w: any) => w.id === "model");
      assert(modelWidget.colors.name, "model should have name color");
    });

    it("does not overwrite existing config", async () => {
      // Write existing config with playful style
      const existingConfig = {
        version: "1.0.0",
        lines: {
          "0": [{ id: "model", style: "playful", colors: { name: "test" } }],
        },
      };

      await writeFile(configPath, JSON.stringify(existingConfig));

      // Ensure default config (should not overwrite)
      await ensureDefaultConfig();

      // Verify existing config was preserved
      const content = JSON.parse(await readFile(configPath, "utf-8"));
      assert.strictEqual(
        content.lines["0"][0].style,
        "playful",
        "Existing style should be preserved"
      );
    });

    it("creates the resolved config path's directory even when CLAUDE_SCOPE_CONFIG points outside the config dir", async () => {
      // Named breakage: reverting ensureDefaultConfig to
      // `mkdir(getConfigDir())` instead of `mkdir(dirname(configPath))` would
      // fail here, since CLAUDE_SCOPE_CONFIG resolves to a path OUTSIDE
      // getConfigDir() and its containing directory would never get created.
      const outsideDir = await mkdtemp(join(tmpdir(), "claude-scope-outside-config-"));
      const overrideConfigPath = join(outsideDir, "nested", "config.json");
      process.env.CLAUDE_SCOPE_CONFIG = overrideConfigPath;

      try {
        await ensureDefaultConfig();

        assert.ok(
          existsSync(overrideConfigPath),
          "Config should be created at the CLAUDE_SCOPE_CONFIG override path"
        );

        const content = JSON.parse(await readFile(overrideConfigPath, "utf-8"));
        assert.strictEqual(content.version, "1.0.0");
      } finally {
        delete process.env.CLAUDE_SCOPE_CONFIG;
        await rm(outsideDir, { recursive: true, force: true });
      }
    });
  });

  describe("getDefaultConfigPath", () => {
    it("returns the real ~/.claude-scope/config.json path when no override is set", () => {
      const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
      const originalScopeConfig = process.env.CLAUDE_SCOPE_CONFIG;
      delete process.env.CLAUDE_SCOPE_HOME;
      delete process.env.CLAUDE_SCOPE_CONFIG;

      try {
        const path = getDefaultConfigPath();
        assert(path.includes(".claude-scope"));
        assert(path.includes("config.json"));
        assert.strictEqual(path, join(homedir(), ".claude-scope", "config.json"));
      } finally {
        if (originalScopeHome !== undefined) {
          process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
        }
        if (originalScopeConfig !== undefined) {
          process.env.CLAUDE_SCOPE_CONFIG = originalScopeConfig;
        }
      }
    });
  });
});
