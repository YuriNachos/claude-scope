import assert from "node:assert";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import type { ScopeConfig } from "../../../../../src/cli/commands/quick-config/config-schema.js";
import { saveConfig } from "../../../../../src/cli/commands/quick-config/config-writer.js";

// `os.homedir()` ignores `HOME` on Windows, so isolation must go through
// `CLAUDE_SCOPE_HOME` (src/config/paths.ts) instead of overriding HOME - a
// real temp dir from `mkdtemp`, never a hard-coded `/tmp/...` literal (not a
// real path on Windows). `CLAUDE_SCOPE_HOME` *is* the resolved config dir
// (no nested `.claude-scope` segment is appended).
const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
let testConfigDir: string;

describe("ConfigWriter", () => {
  before(async () => {
    testConfigDir = await mkdtemp(join(tmpdir(), "claude-scope-config-writer-"));
    process.env.CLAUDE_SCOPE_HOME = testConfigDir;
  });

  after(async () => {
    await rm(testConfigDir, { recursive: true, force: true });
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
  });

  it("should create config file with formatted JSON", async () => {
    const testConfig: ScopeConfig = {
      version: "1.0.0",
      lines: {
        "0": [
          {
            id: "model",
            style: "balanced",
            colors: { name: "test", version: "test" },
          },
        ],
      },
    };

    await saveConfig(testConfig);

    // Verify file was created with correct content
    const configPath = join(testConfigDir, "config.json");
    const content = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);

    assert.strictEqual(parsed.version, "1.0.0");
    assert.ok(parsed.lines["0"]);
    assert.strictEqual(parsed.lines["0"][0].id, "model");
    assert.strictEqual(parsed.lines["0"][0].style, "balanced");
  });

  it("should overwrite existing config file", async () => {
    const config1: ScopeConfig = {
      version: "1.0.0",
      lines: {
        "0": [
          {
            id: "model",
            style: "balanced",
            colors: { name: "v1", version: "" },
          },
        ],
      },
    };

    await saveConfig(config1);

    const config2: ScopeConfig = {
      version: "1.0.1",
      lines: {
        "0": [
          {
            id: "model",
            style: "compact",
            colors: { name: "v2", version: "" },
          },
        ],
      },
    };

    await saveConfig(config2);

    // Verify second write overwrote the first
    const configPath = join(testConfigDir, "config.json");
    const content = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);

    assert.strictEqual(parsed.version, "1.0.1");
    assert.strictEqual(parsed.lines["0"][0].style, "compact");
    assert.strictEqual(parsed.lines["0"][0].colors.name, "v2");
  });

  it("should format JSON with 2-space indentation", async () => {
    const testConfig: ScopeConfig = {
      version: "1.0.0",
      lines: {
        "0": [
          {
            id: "model",
            style: "balanced",
            colors: { name: "test", version: "test" },
          },
        ],
      },
    };

    await saveConfig(testConfig);

    const configPath = join(testConfigDir, "config.json");
    const content = await readFile(configPath, "utf-8");

    // Verify 2-space indentation by checking for specific spacing pattern
    assert.ok(content.includes('  "version"'));
    assert.ok(content.includes('    "id"'));
  });

  it("should create directory if it does not exist", async () => {
    // Use a unique subdirectory (not yet created) to test directory creation
    const uniqueDir = join(testConfigDir, `new-${Date.now()}`);
    process.env.CLAUDE_SCOPE_HOME = uniqueDir;

    const testConfig: ScopeConfig = {
      version: "1.0.0",
      lines: {
        "0": [
          {
            id: "model",
            style: "balanced",
            colors: { name: "test", version: "test" },
          },
        ],
      },
    };

    await saveConfig(testConfig);

    const configPath = join(uniqueDir, "config.json");
    const content = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);

    assert.strictEqual(parsed.version, "1.0.0");

    // Cleanup
    await rm(uniqueDir, { recursive: true, force: true });
    process.env.CLAUDE_SCOPE_HOME = testConfigDir;
  });
});
