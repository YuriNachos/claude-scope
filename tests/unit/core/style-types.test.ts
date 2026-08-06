import assert from "node:assert";
import { describe, it } from "node:test";
import {
  DEFAULT_WIDGET_STYLE,
  isValidWidgetStyle,
  WIDGET_STYLES,
  type WidgetStyle,
} from "../../../src/core/style-types.js";

describe("style-types", () => {
  describe("WidgetStyle type", () => {
    it("should accept valid style strings", () => {
      const validStyles: WidgetStyle[] = [
        "balanced",
        "minimal",
        "compact",
        "playful",
        "verbose",
        "technical",
        "symbolic",
        "monochrome",
        "compact-verbose",
        "labeled",
        "indicator",
        "emoji",
      ];
      assert.equal(validStyles.length, 12);
    });

    it("should have balanced as default style", () => {
      assert.equal(DEFAULT_WIDGET_STYLE, "balanced");
    });
  });

  describe("isValidWidgetStyle", () => {
    it("should return true for valid styles", () => {
      assert.equal(isValidWidgetStyle("balanced"), true);
      assert.equal(isValidWidgetStyle("compact"), true);
      assert.equal(isValidWidgetStyle("minimal"), true);
    });

    it("should return false for invalid styles", () => {
      assert.equal(isValidWidgetStyle("invalid"), false);
      assert.equal(isValidWidgetStyle("BALANCED"), false); // case sensitive
      assert.equal(isValidWidgetStyle(""), false);
    });

    it("should type-narrow correctly", () => {
      const value = "compact" as string;
      if (isValidWidgetStyle(value)) {
        // value is now typed as WidgetStyle
        assert.equal(value, "compact");
      }
    });
  });

  describe("isValidWidgetStyle / WIDGET_STYLES stay in sync", () => {
    // Named breakage: WidgetStyle/isValidWidgetStyle used to derive from a
    // hardcoded literal list duplicated here and in style-types.ts; reverting
    // isValidWidgetStyle to check its own hardcoded copy (instead of the
    // WIDGET_STYLES single source of truth) would let the two drift again -
    // a style added to one and forgotten in the other.
    it("accepts every style listed in WIDGET_STYLES", () => {
      for (const style of WIDGET_STYLES) {
        assert.equal(isValidWidgetStyle(style), true, `expected "${style}" to be valid`);
      }
    });

    it("rejects a style that is not in WIDGET_STYLES", () => {
      assert.equal(isValidWidgetStyle("not-a-real-style"), false);
    });
  });
});
