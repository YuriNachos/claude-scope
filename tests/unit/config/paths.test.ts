// tests/unit/config/paths.test.ts
import assert from "node:assert";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  getCacheDir,
  getCachePath,
  getConfigDir,
  getConfigPath,
} from "../../../src/config/paths.js";

describe("paths", () => {
  const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
  const originalScopeConfig = process.env.CLAUDE_SCOPE_CONFIG;

  beforeEach(() => {
    delete process.env.CLAUDE_SCOPE_HOME;
    delete process.env.CLAUDE_SCOPE_CONFIG;
  });

  afterEach(() => {
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
    if (originalScopeConfig === undefined) {
      delete process.env.CLAUDE_SCOPE_CONFIG;
    } else {
      process.env.CLAUDE_SCOPE_CONFIG = originalScopeConfig;
    }
  });

  describe("default locations (no override set)", () => {
    it("getConfigDir returns ~/.claude-scope", () => {
      assert.strictEqual(getConfigDir(), join(homedir(), ".claude-scope"));
    });

    it("getConfigPath returns ~/.claude-scope/config.json", () => {
      assert.strictEqual(getConfigPath(), join(homedir(), ".claude-scope", "config.json"));
    });

    it("getCacheDir returns ~/.config/claude-scope", () => {
      assert.strictEqual(getCacheDir(), join(homedir(), ".config", "claude-scope"));
    });

    it("getCachePath returns ~/.config/claude-scope/cache.json", () => {
      assert.strictEqual(getCachePath(), join(homedir(), ".config", "claude-scope", "cache.json"));
    });
  });

  describe("CLAUDE_SCOPE_HOME override", () => {
    it("getConfigDir returns CLAUDE_SCOPE_HOME verbatim", () => {
      const override = join(tmpdir(), "claude-scope-paths-test-config-dir");
      process.env.CLAUDE_SCOPE_HOME = override;

      assert.strictEqual(getConfigDir(), override);
    });

    it("getConfigPath appends config.json to CLAUDE_SCOPE_HOME", () => {
      const override = join(tmpdir(), "claude-scope-paths-test-config-path");
      process.env.CLAUDE_SCOPE_HOME = override;

      assert.strictEqual(getConfigPath(), join(override, "config.json"));
    });

    it("getCacheDir returns CLAUDE_SCOPE_HOME verbatim", () => {
      const override = join(tmpdir(), "claude-scope-paths-test-cache-dir");
      process.env.CLAUDE_SCOPE_HOME = override;

      assert.strictEqual(getCacheDir(), override);
    });

    it("getCachePath appends cache.json to CLAUDE_SCOPE_HOME", () => {
      const override = join(tmpdir(), "claude-scope-paths-test-cache-path");
      process.env.CLAUDE_SCOPE_HOME = override;

      assert.strictEqual(getCachePath(), join(override, "cache.json"));
    });
  });

  describe("CLAUDE_SCOPE_CONFIG wins over CLAUDE_SCOPE_HOME", () => {
    it("getConfigPath uses CLAUDE_SCOPE_CONFIG even when CLAUDE_SCOPE_HOME is also set", () => {
      const homeOverride = join(tmpdir(), "claude-scope-paths-test-home");
      const configOverride = join(
        tmpdir(),
        "claude-scope-paths-test-explicit-config",
        "config.json"
      );
      process.env.CLAUDE_SCOPE_HOME = homeOverride;
      process.env.CLAUDE_SCOPE_CONFIG = configOverride;

      assert.strictEqual(getConfigPath(), configOverride);
      assert.notStrictEqual(getConfigPath(), join(homeOverride, "config.json"));
    });

    it("getConfigDir ignores CLAUDE_SCOPE_CONFIG and still reflects CLAUDE_SCOPE_HOME", () => {
      const homeOverride = join(tmpdir(), "claude-scope-paths-test-home-dir");
      const configOverride = join(
        tmpdir(),
        "claude-scope-paths-test-explicit-config-2",
        "config.json"
      );
      process.env.CLAUDE_SCOPE_HOME = homeOverride;
      process.env.CLAUDE_SCOPE_CONFIG = configOverride;

      assert.strictEqual(getConfigDir(), homeOverride);
    });
  });

  describe("re-resolution per call (no module-level caching)", () => {
    it("getConfigDir reflects a CLAUDE_SCOPE_HOME change between two calls", () => {
      const first = join(tmpdir(), "claude-scope-paths-test-rereso-a");
      const second = join(tmpdir(), "claude-scope-paths-test-rereso-b");

      process.env.CLAUDE_SCOPE_HOME = first;
      const firstResult = getConfigDir();

      process.env.CLAUDE_SCOPE_HOME = second;
      const secondResult = getConfigDir();

      assert.strictEqual(firstResult, first);
      assert.strictEqual(secondResult, second);
      assert.notStrictEqual(firstResult, secondResult);
    });

    it("getConfigPath reflects a CLAUDE_SCOPE_CONFIG change between two calls", () => {
      const first = join(tmpdir(), "claude-scope-paths-test-rereso-config-a", "config.json");
      const second = join(tmpdir(), "claude-scope-paths-test-rereso-config-b", "config.json");

      process.env.CLAUDE_SCOPE_CONFIG = first;
      const firstResult = getConfigPath();

      process.env.CLAUDE_SCOPE_CONFIG = second;
      const secondResult = getConfigPath();

      assert.strictEqual(firstResult, first);
      assert.strictEqual(secondResult, second);
      assert.notStrictEqual(firstResult, secondResult);
    });
  });
});
