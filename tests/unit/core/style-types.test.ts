import assert from "node:assert";
import { describe, it } from "node:test";
import {
  DEFAULT_WIDGET_STYLE,
  isValidWidgetStyle,
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
});
