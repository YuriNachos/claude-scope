/**
 * Tests for config color field consistency
 * Ensures generated configs use correct color field names for each widget
 */
import assert from "node:assert";
import { describe, it } from "node:test";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateConfigWithStyleAndTheme,
  generateRichLayout,
} from "../../../src/config/default-config.js";

describe("ColorFieldConsistency", () => {
  const layouts = [
    { name: "default", fn: () => generateConfigWithStyleAndTheme("balanced", "monokai") },
    { name: "balanced", fn: () => generateBalancedLayout("balanced", "monokai") },
    { name: "compact", fn: () => generateCompactLayout("balanced", "monokai") },
    { name: "rich", fn: () => generateRichLayout("balanced", "monokai") },
  ];

  for (const { name, fn } of layouts) {
    describe(`${name} layout`, () => {
      it("model widget has name and version colors", () => {
        const config = fn();
        const widget = config.lines["0"]?.find((w) => w.id === "model");
        if (widget) {
          assert.ok("name" in widget.colors!, `${name}: model should have name color`);
          assert.ok("version" in widget.colors!, `${name}: model should have version color`);
        }
      });

      it("context widget has low, medium, high, bar colors", () => {
        const config = fn();
        const widget = config.lines["0"]?.find((w) => w.id === "context");
        if (widget) {
          assert.ok("low" in widget.colors!, `${name}: context should have low color`);
          assert.ok("medium" in widget.colors!, `${name}: context should have medium color`);
          assert.ok("high" in widget.colors!, `${name}: context should have high color`);
          assert.ok("bar" in widget.colors!, `${name}: context should have bar color`);
        }
      });

      it("git widget has branch and changes colors", () => {
        const config = fn();
        const allWidgets = Object.values(config.lines).flat();
        const widget = allWidgets.find((w) => w.id === "git");
        if (widget) {
          assert.ok("branch" in widget.colors!, `${name}: git should have branch color`);
          assert.ok("changes" in widget.colors!, `${name}: git should have changes color`);
        }
      });

      it("git-tag widget has branch color (not base)", () => {
        const config = fn();
        const allWidgets = Object.values(config.lines).flat();
        const widget = allWidgets.find((w) => w.id === "git-tag");
        if (widget) {
          assert.ok("branch" in widget.colors!, `${name}: git-tag should have branch color`);
          assert.ok(!("base" in widget.colors!), `${name}: git-tag should NOT have base color`);
        }
      });

      it("config-count widget has label and separator colors (not base)", () => {
        const config = fn();
        const allWidgets = Object.values(config.lines).flat();
        const widget = allWidgets.find((w) => w.id === "config-count");
        if (widget) {
          assert.ok("label" in widget.colors!, `${name}: config-count should have label color`);
          assert.ok(
            "separator" in widget.colors!,
            `${name}: config-count should have separator color`
          );
          assert.ok(
            !("base" in widget.colors!),
            `${name}: config-count should NOT have base color`
          );
        }
      });

      it("sysmon widget has cpu, ram, disk, network, separator colors", () => {
        const config = fn();
        const widget = config.lines["3"]?.find((w) => w.id === "sysmon");
        if (widget) {
          assert.ok("cpu" in widget.colors!, `${name}: sysmon should have cpu color`);
          assert.ok("ram" in widget.colors!, `${name}: sysmon should have ram color`);
          assert.ok("disk" in widget.colors!, `${name}: sysmon should have disk color`);
          assert.ok("network" in widget.colors!, `${name}: sysmon should have network color`);
          assert.ok("separator" in widget.colors!, `${name}: sysmon should have separator color`);
        }
      });
    });
  }
});
