/**
 * Unit tests for ConfigProvider
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import { rimraf } from "rimraf";
import { ConfigProvider } from "../../../src/providers/config-provider.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testHomeDir = path.join(__dirname, "../../fixtures/config-home");
const testProjectDir = path.join(__dirname, "../../fixtures/config-project");
// Dedicated fixtures for the homeDir-option tests below, kept separate from
// testHomeDir so their rule counts can't accidentally collide with it.
const honorHomeDir = path.join(__dirname, "../../fixtures/config-home-honor");
const fallbackHomeDir = path.join(__dirname, "../../fixtures/config-home-fallback");
const missingHomeDir = path.join(__dirname, "../../fixtures/config-home-missing");

describe("ConfigProvider", () => {
  before(async () => {
    // Create test home structure
    await fs.mkdir(path.join(testHomeDir, ".claude", "rules"), { recursive: true });
    await fs.writeFile(path.join(testHomeDir, ".claude", "CLAUDE.md"), "# User CLAUDE.md");
    await fs.writeFile(path.join(testHomeDir, ".claude", "rules", "rule1.md"), "# Rule 1");
    await fs.writeFile(path.join(testHomeDir, ".claude", "rules", "rule2.md"), "# Rule 2");
    await fs.writeFile(
      path.join(testHomeDir, ".claude", "settings.json"),
      JSON.stringify({
        mcpServers: { mcp1: { command: "node", args: ["server.js"] } },
        hooks: { "pre-commit": 'echo "pre-commit"' },
      })
    );

    // Create test project structure
    await fs.mkdir(path.join(testProjectDir, ".claude", "rules"), { recursive: true });
    await fs.writeFile(path.join(testProjectDir, "CLAUDE.md"), "# Project CLAUDE.md");
    await fs.writeFile(path.join(testProjectDir, ".claude", "rules", "rule3.md"), "# Rule 3");
    await fs.writeFile(
      path.join(testProjectDir, ".claude", "settings.json"),
      JSON.stringify({
        mcpServers: { mcp2: { command: "python", args: ["server.py"] } },
      })
    );

    // Fixture with a known, distinct rule count for the homeDir-honoured test
    await fs.mkdir(path.join(honorHomeDir, ".claude", "rules"), { recursive: true });
    await fs.writeFile(path.join(honorHomeDir, ".claude", "rules", "a.md"), "# A");
    await fs.writeFile(path.join(honorHomeDir, ".claude", "rules", "b.md"), "# B");
    await fs.writeFile(path.join(honorHomeDir, ".claude", "rules", "c.md"), "# C");

    // Fixture with a different known rule count for the os.homedir()-fallback test
    await fs.mkdir(path.join(fallbackHomeDir, ".claude", "rules"), { recursive: true });
    await fs.writeFile(path.join(fallbackHomeDir, ".claude", "rules", "only.md"), "# Only");
  });

  after(async () => {
    // Cleanup test directories
    await rimraf(testHomeDir);
    await rimraf(testProjectDir);
    await rimraf(honorHomeDir);
    await rimraf(fallbackHomeDir);
  });

  it("should count user-scope configs", async () => {
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ homeDir: testHomeDir });

    expect(configs.claudeMdCount).to.equal(1);
    expect(configs.rulesCount).to.equal(2);
    expect(configs.mcpCount).to.equal(1);
    expect(configs.hooksCount).to.equal(1);
  });

  it("should count project-scope configs", async () => {
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ homeDir: testHomeDir, cwd: testProjectDir });

    expect(configs.claudeMdCount).to.equal(2); // 1 user + 1 project
    expect(configs.rulesCount).to.equal(3); // 2 user + 1 project
    expect(configs.mcpCount).to.equal(2); // 1 user + 1 project
  });

  it("should use cache with 5-second interval", async () => {
    const provider = new ConfigProvider();

    const first = await provider.getConfigs({ homeDir: testHomeDir });
    // Add new rule file (should not be counted due to cache)
    await fs.writeFile(path.join(testHomeDir, ".claude", "rules", "rule3.md"), "# Rule 3");

    const second = await provider.getConfigs({ homeDir: testHomeDir });
    expect(second).to.deep.equal(first); // Cache hit

    // Wait for cache to expire
    await new Promise((resolve) => setTimeout(resolve, 5100));

    const third = await provider.getConfigs({ homeDir: testHomeDir });
    expect(third.rulesCount).to.be.greaterThan(first.rulesCount); // Cache miss
  });

  it("should return zeros when no configs exist", async () => {
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ homeDir: missingHomeDir });

    expect(configs.claudeMdCount).to.equal(0);
    expect(configs.rulesCount).to.equal(0);
    expect(configs.mcpCount).to.equal(0);
    expect(configs.hooksCount).to.equal(0);
  });

  it("should handle missing project directory", async () => {
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ homeDir: testHomeDir, cwd: missingHomeDir });

    // Should still return user-scope configs
    expect(configs.claudeMdCount).to.equal(1);
  });

  // config-provider.ts:scanConfigs - proves `options.homeDir ?? os.homedir()` is
  // actually honoured. If a future edit reverts to the hardwired `os.homedir()`,
  // this fixture (3 known rule files) is ignored in favor of the real machine
  // home directory and the count below stops matching.
  it("should honor the homeDir option over os.homedir()", async () => {
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ homeDir: honorHomeDir });

    expect(configs.rulesCount).to.equal(3);
  });

  // config-provider.ts:scanConfigs - proves that OMITTING homeDir still falls
  // back to os.homedir(). Temporarily points the real home directory (via the
  // env vars os.homedir() reads on POSIX and Windows) at a fixture so the
  // check never touches the developer's actual ~/.claude.
  it("should fall back to os.homedir() when homeDir is omitted", async () => {
    const originalHome = process.env.HOME;
    const originalUserProfile = process.env.USERPROFILE;
    process.env.HOME = fallbackHomeDir;
    process.env.USERPROFILE = fallbackHomeDir;
    try {
      const provider = new ConfigProvider();
      const configs = await provider.getConfigs();

      expect(configs.rulesCount).to.equal(1);
    } finally {
      if (originalHome === undefined) {
        delete process.env.HOME;
      } else {
        process.env.HOME = originalHome;
      }
      if (originalUserProfile === undefined) {
        delete process.env.USERPROFILE;
      } else {
        process.env.USERPROFILE = originalUserProfile;
      }
    }
  });
});
