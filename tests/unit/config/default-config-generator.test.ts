// tests/unit/config/default-config-generator.test.ts
import assert from "node:assert";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  ensureDefaultConfig,
  getDefaultConfigPath,
} from "../../../src/config/default-config-generator.js";

const REAL_CONFIG_PATH = getDefaultConfigPath();

function cleanupRealConfig(): void {
  if (existsSync(REAL_CONFIG_PATH)) {
    rmSync(REAL_CONFIG_PATH);
  }
}

test.beforeEach(() => {
  cleanupRealConfig();
});

test.afterEach(() => {
  cleanupRealConfig();
});

test("ensureDefaultConfig creates config with rich layout, balanced style, monokai theme", async () => {
  // Ensure default config exists
  await ensureDefaultConfig();

  // Verify file was created
  assert(existsSync(REAL_CONFIG_PATH), "Config file should exist");

  // Read and verify content
  const content = JSON.parse(await readFile(REAL_CONFIG_PATH, "utf-8"));

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

test("ensureDefaultConfig does not overwrite existing config", async () => {
  // Write existing config with playful style
  const existingConfig = {
    version: "1.0.0",
    lines: {
      "0": [{ id: "model", style: "playful", colors: { name: "test" } }],
    },
  };

  writeFileSync(REAL_CONFIG_PATH, JSON.stringify(existingConfig));

  // Ensure default config (should not overwrite)
  await ensureDefaultConfig();

  // Verify existing config was preserved
  const content = JSON.parse(await readFile(REAL_CONFIG_PATH, "utf-8"));
  assert.strictEqual(content.lines["0"][0].style, "playful", "Existing style should be preserved");
});

test("getDefaultConfigPath returns correct path", () => {
  const path = getDefaultConfigPath();
  assert(path.includes(".claude-scope"));
  assert(path.includes("config.json"));
  assert.strictEqual(path, join(homedir(), ".claude-scope", "config.json"));
});
