// tests/unit/config/theme-application.test.ts
import assert from "node:assert";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
} from "../../../src/config/default-config.js";
import { getThemeByName } from "../../../src/ui/theme/index.js";

const CONFIG_DIR = join(homedir(), ".claude-scope");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

function cleanupConfig(): void {
  if (existsSync(CONFIG_PATH)) {
    rmSync(CONFIG_PATH);
  }
}

test.beforeEach(() => {
  cleanupConfig();
});

test.afterEach(() => {
  cleanupConfig();
});

test("generateRichLayout includes theme name in config", () => {
  const config = generateRichLayout("balanced", "catppuccin-mocha");

  assert.strictEqual(config.theme, "catppuccin-mocha", "Config should include theme name");
});

test("generateBalancedLayout includes theme name in config", () => {
  const config = generateBalancedLayout("balanced", "dracula");

  assert.strictEqual(config.theme, "dracula", "Config should include theme name");
});

test("generateCompactLayout includes theme name in config", () => {
  const config = generateCompactLayout("compact", "nord");

  assert.strictEqual(config.theme, "nord", "Config should include theme name");
});

test("generated config colors match the specified theme", () => {
  const themeName = "catppuccin-mocha";
  const config = generateRichLayout("balanced", themeName);
  const theme = getThemeByName(themeName).colors;

  // Find model widget in line 0
  const modelWidget = config.lines["0"].find((w) => w.id === "model");
  assert(modelWidget, "Model widget should exist");
  assert(modelWidget.colors, "Model widget should have colors");

  // Verify colors match the theme
  assert.strictEqual(
    modelWidget.colors.name,
    theme.model.name,
    "Model name color should match theme"
  );
});

test("different themes produce different colors", () => {
  const config1 = generateRichLayout("balanced", "monokai");
  const config2 = generateRichLayout("balanced", "catppuccin-mocha");

  const model1 = config1.lines["0"].find((w) => w.id === "model");
  const model2 = config2.lines["0"].find((w) => w.id === "model");

  assert(model1?.colors && model2?.colors, "Both configs should have model colors");

  // Monokai and Catppuccin have different color schemes
  assert.notStrictEqual(
    model1.colors.name,
    model2.colors.name,
    "Different themes should produce different colors"
  );
});

test("config theme field is used for all layouts", () => {
  const themes = ["monokai", "dracula", "nord", "catppuccin-mocha"];
  const layouts = [
    { name: "rich", fn: generateRichLayout },
    { name: "balanced", fn: generateBalancedLayout },
    { name: "compact", fn: generateCompactLayout },
  ];

  for (const layout of layouts) {
    for (const themeName of themes) {
      const config = layout.fn("balanced", themeName);
      assert.strictEqual(
        config.theme,
        themeName,
        `${layout.name} layout with ${themeName} should have theme field set`
      );
    }
  }
});
