/**
 * Theme snapshot tests
 * Verifies theme structure doesn't change unexpectedly
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { AVAILABLE_THEMES } from "../../../../src/ui/theme/index.js";
import type { ITheme } from "../../../../src/ui/theme/types.js";

describe("Theme Snapshots", () => {
  AVAILABLE_THEMES.forEach((theme) => {
    it(`${theme.name} has correct structure`, () => {
      // Verify theme has required properties
      assert.strictEqual(typeof theme.name, "string");
      assert.strictEqual(typeof theme.description, "string");
      assert.ok(theme.name.length > 0);
      assert.ok(theme.description.length > 0);

      // Verify colors object exists and has all required sections
      assert.ok(theme.colors, "Theme should have colors object");
      assert.ok(theme.colors.base, "Theme should have base colors");
      assert.ok(theme.colors.semantic, "Theme should have semantic colors");
      assert.ok(theme.colors.git, "Theme should have git colors");
      assert.ok(theme.colors.context, "Theme should have context colors");
      assert.ok(theme.colors.lines, "Theme should have lines colors");
      assert.ok(theme.colors.cost, "Theme should have cost colors");
      assert.ok(theme.colors.duration, "Theme should have duration colors");
      assert.ok(theme.colors.model, "Theme should have model colors");
      assert.ok(theme.colors.poker, "Theme should have poker colors");

      // Verify colors are ANSI escape codes (start with \x1b)
      const checkAnsiColor = (color: string) => {
        assert.ok(color.startsWith("\x1b["), `Color ${color} should be an ANSI escape code`);
      };

      // Check base colors
      checkAnsiColor(theme.colors.base.text);
      checkAnsiColor(theme.colors.base.muted);
      checkAnsiColor(theme.colors.base.accent);

      // Check semantic colors
      checkAnsiColor(theme.colors.semantic.success);
      checkAnsiColor(theme.colors.semantic.warning);
      checkAnsiColor(theme.colors.semantic.error);
      checkAnsiColor(theme.colors.semantic.info);

      // Check git colors
      checkAnsiColor(theme.colors.git.branch);
      checkAnsiColor(theme.colors.git.changes);

      // Check context colors
      checkAnsiColor(theme.colors.context.low);
      checkAnsiColor(theme.colors.context.medium);
      checkAnsiColor(theme.colors.context.high);
      checkAnsiColor(theme.colors.context.bar);

      // Check lines colors
      checkAnsiColor(theme.colors.lines.added);
      checkAnsiColor(theme.colors.lines.removed);

      // Check cost colors
      checkAnsiColor(theme.colors.cost.amount);
      checkAnsiColor(theme.colors.cost.currency);

      // Check duration colors
      checkAnsiColor(theme.colors.duration.value);
      checkAnsiColor(theme.colors.duration.unit);

      // Check model colors
      checkAnsiColor(theme.colors.model.name);
      checkAnsiColor(theme.colors.model.version);

      // Check poker colors
      checkAnsiColor(theme.colors.poker.participating);
      checkAnsiColor(theme.colors.poker.nonParticipating);
      checkAnsiColor(theme.colors.poker.result);
    });
  });
});
