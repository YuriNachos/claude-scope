import { describe, it } from "node:test";
import assert from "node:assert";
import {
  type WidgetStyle,
  DEFAULT_WIDGET_STYLE,
  getDefaultStyleConfig,
  isValidWidgetStyle,
  type WidgetStyleConfig,
  type StyleConfig,
} from "../../../src/core/style-types.js";

describe("style-types", () => {
  describe("WidgetStyle type", () => {
    it("should accept valid style strings", () => {
      const validStyles: WidgetStyle[] = [
        "balanced",
        "compact",
        "playful",
        "verbose",
        "technical",
        "symbolic",
        "monochrome",
        "compact-verbose",
        "labeled",
        "indicator",
        "fancy",
      ];
      assert.equal(validStyles.length, 11);
    });

    it("should have balanced as default style", () => {
      assert.equal(DEFAULT_WIDGET_STYLE, "balanced");
    });
  });

  describe("getDefaultStyleConfig", () => {
    it("should return config with default style when no argument", () => {
      const config = getDefaultStyleConfig();
      assert.deepEqual(config, { style: "balanced" });
    });

    it("should return config with specified style", () => {
      const config = getDefaultStyleConfig("compact");
      assert.deepEqual(config, { style: "compact" });
    });
  });

  describe("isValidWidgetStyle", () => {
    it("should return true for valid styles", () => {
      assert.equal(isValidWidgetStyle("balanced"), true);
      assert.equal(isValidWidgetStyle("compact"), true);
      assert.equal(isValidWidgetStyle("fancy"), true);
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
