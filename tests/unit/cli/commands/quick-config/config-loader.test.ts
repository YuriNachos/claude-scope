import assert from "node:assert";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { after, before, describe, it } from "node:test";
import {
  getUserConfigDir,
  getUserConfigPath,
  loadConfig,
} from "../../../../../src/cli/commands/quick-config/config-loader.js";

const testHomeDir = "/tmp/test-claude-scope-config";
const testConfigDir = `${testHomeDir}/.claude-scope`;

describe("ConfigLoader", () => {
  const originalHome = process.env.HOME;

  before(async () => {
    // Set HOME environment variable to test directory
    process.env.HOME = testHomeDir;

    // Create test directory
    await mkdir(testConfigDir, { recursive: true });
  });

  after(async () => {
    // Clean up test directory
    await rm(testHomeDir, { recursive: true, force: true });

    // Restore original HOME
    process.env.HOME = originalHome;
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
      assert.strictEqual(result, `${testConfigDir}/config.json`);
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

      const testConfigPath = `${testConfigDir}/config.json`;
      await writeFile(testConfigPath, JSON.stringify(validConfig));

      const config = await loadConfig();
      assert.deepStrictEqual(config, validConfig);
    });

    it("should return null for corrupt JSON", async () => {
      const testConfigPath = `${testConfigDir}/config.json`;
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

      const testConfigPath = `${testConfigDir}/config.json`;
      await writeFile(testConfigPath, JSON.stringify(invalidConfig));

      const config = await loadConfig();
      assert.strictEqual(config, null);
    });

    it("should return null for config missing lines", async () => {
      const invalidConfig = {
        version: "1.0.0",
      };

      const testConfigPath = `${testConfigDir}/config.json`;
      await writeFile(testConfigPath, JSON.stringify(invalidConfig));

      const config = await loadConfig();
      assert.strictEqual(config, null);
    });
  });
});
