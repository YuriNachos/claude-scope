import assert from "node:assert";
import { readFile, rm } from "node:fs/promises";
import { after, before, describe, it } from "node:test";
import type { ScopeConfig } from "../../../../../src/cli/commands/quick-config/config-schema.js";
import { saveConfig } from "../../../../../src/cli/commands/quick-config/config-writer.js";

const testHomeDir = "/tmp/test-claude-scope-write";
const originalHome = process.env.HOME;

describe("ConfigWriter", () => {
  before(async () => {
    process.env.HOME = testHomeDir;
  });

  after(async () => {
    await rm(testHomeDir, { recursive: true, force: true });
    process.env.HOME = originalHome;
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
    const configPath = `${testHomeDir}/.claude-scope/config.json`;
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
    const configPath = `${testHomeDir}/.claude-scope/config.json`;
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

    const configPath = `${testHomeDir}/.claude-scope/config.json`;
    const content = await readFile(configPath, "utf-8");

    // Verify 2-space indentation by checking for specific spacing pattern
    assert.ok(content.includes('  "version"'));
    assert.ok(content.includes('    "id"'));
  });

  it("should create directory if it does not exist", async () => {
    // Use a unique subdirectory to test directory creation
    const uniqueDir = `${testHomeDir}/new-${Date.now()}`;
    process.env.HOME = uniqueDir;

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

    const configPath = `${uniqueDir}/.claude-scope/config.json`;
    const content = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);

    assert.strictEqual(parsed.version, "1.0.0");

    // Cleanup
    await rm(uniqueDir, { recursive: true, force: true });
    process.env.HOME = testHomeDir;
  });
});
