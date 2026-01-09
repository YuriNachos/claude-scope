/**
 * Theme validation tests
 * Tests that all themes conform to ITheme interface and have valid ANSI colors
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { AVAILABLE_THEMES } from "../../../../src/ui/theme/index.js";

describe("Theme Validation", () => {
  // ANSI color patterns:
  // - RGB format: \u001b[38;2;R;G;Bm where R,G,B are 0-255
  // - Basic format: \u001b[30-37m or \u001b[90-97m
  const ansiColorPattern = /^\u001b\[(?:38;2;\d{1,3};\d{1,3};\d{1,3}|\d{1,3})m$/;

  describe("all themes conform to ITheme interface", () => {
    AVAILABLE_THEMES.forEach((theme) => {
      it(`${theme.name} has required properties`, () => {
        expect(theme).to.have.property("name");
        expect(theme).to.have.property("description");
        expect(theme).to.have.property("colors");
      });

      it(`${theme.name} has non-empty name`, () => {
        expect(theme.name.length).to.be.greaterThan(0);
        expect(theme.name).to.match(/^[a-z0-9-]+$/);
      });

      it(`${theme.name} has non-empty description`, () => {
        expect(theme.description.length).to.be.greaterThan(0);
      });
    });
  });

  describe("all theme colors have valid ANSI codes", () => {
    AVAILABLE_THEMES.forEach((theme) => {
      it(`${theme.name} colors are valid ANSI codes`, () => {
        const { colors } = theme;

        // Check all color sections
        const colorSections = [
          colors.base.text,
          colors.base.muted,
          colors.base.accent,
          colors.base.border,
          colors.semantic.success,
          colors.semantic.warning,
          colors.semantic.error,
          colors.semantic.info,
          colors.git.branch,
          colors.git.changes,
          colors.context.low,
          colors.context.medium,
          colors.context.high,
          colors.context.bar,
          colors.lines.added,
          colors.lines.removed,
          colors.cost.amount,
          colors.cost.currency,
          colors.duration.value,
          colors.duration.unit,
          colors.model.name,
          colors.model.version,
          colors.poker.participating,
          colors.poker.nonParticipating,
          colors.poker.result,
        ];

        colorSections.forEach((color) => {
          expect(color).to.match(ansiColorPattern);
        });
      });
    });
  });

  describe("theme names are unique", () => {
    it("no duplicate theme names", () => {
      const names = AVAILABLE_THEMES.map((t) => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).to.equal(names.length);
    });
  });
});
