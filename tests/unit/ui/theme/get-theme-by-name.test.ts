/**
 * getThemeByName function tests
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import {
  AVAILABLE_THEMES,
  DEFAULT_THEME_OBJECT,
  getThemeByName,
} from "../../../../src/ui/theme/index.js";

describe("getThemeByName", () => {
  it("returns correct theme for valid name", () => {
    const nordTheme = getThemeByName("nord");
    assert.strictEqual(nordTheme.name, "nord");
    assert.ok(nordTheme.description.includes("Arctic"));
  });

  it("returns VSCode Dark+ for unknown theme name", () => {
    const unknownTheme = getThemeByName("non-existent-theme");
    assert.strictEqual(unknownTheme.name, "vscode-dark-plus");
  });

  it("returns VSCode Dark+ for empty string", () => {
    const emptyTheme = getThemeByName("");
    assert.strictEqual(emptyTheme.name, "vscode-dark-plus");
  });

  it("all available themes can be retrieved by name", () => {
    AVAILABLE_THEMES.forEach((theme) => {
      const retrieved = getThemeByName(theme.name);
      assert.strictEqual(retrieved.name, theme.name);
      assert.strictEqual(retrieved.description, theme.description);
    });
  });

  it("DEFAULT_THEME_OBJECT is VSCode Dark+", () => {
    assert.strictEqual(DEFAULT_THEME_OBJECT.name, "vscode-dark-plus");
  });

  it("DEFAULT_THEME colors match VSCode Dark+", () => {
    const vscodePlus = getThemeByName("vscode-dark-plus");
    assert.deepStrictEqual(DEFAULT_THEME_OBJECT, vscodePlus);
  });
});
