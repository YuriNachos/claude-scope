import assert from "node:assert";
import { describe, it } from "node:test";
import {
  generatePreviews,
  type PreviewChoice,
} from "../../../../../src/cli/commands/quick-config/select-with-preview.js";
import {
  generateBalancedLayout,
  generateCompactLayout,
} from "../../../../../src/config/default-config.js";

describe("selectWithPreview", () => {
  describe("PreviewChoice interface", () => {
    it("should have correct interface types", () => {
      const choice: PreviewChoice<string> = {
        name: "Test",
        value: "test",
        description: "Test description",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      assert.strictEqual(typeof choice.getConfig, "function");
      assert.strictEqual(choice.name, "Test");
      assert.strictEqual(choice.value, "test");
      assert.strictEqual(choice.description, "Test description");
    });

    it("should support optional description", () => {
      const choiceWithoutDesc: PreviewChoice<string> = {
        name: "Test",
        value: "test",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      assert.strictEqual(choiceWithoutDesc.description, undefined);
    });

    it("should support different value types", () => {
      const stringChoice: PreviewChoice<string> = {
        name: "String",
        value: "string-value",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      const numberChoice: PreviewChoice<number> = {
        name: "Number",
        value: 42,
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      assert.strictEqual(stringChoice.value, "string-value");
      assert.strictEqual(numberChoice.value, 42);
    });
  });

  describe("getConfig function", () => {
    it("should generate valid config with balanced layout", () => {
      const choice: PreviewChoice<string> = {
        name: "Balanced",
        value: "balanced",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      const config = choice.getConfig("balanced", "monokai");

      assert.strictEqual(config.version, "1.0.0");
      assert.ok(config.lines["0"]);
      assert.ok(config.lines["1"]);
      assert.strictEqual(config.lines["0"]?.[0].id, "model");
      assert.strictEqual(config.lines["1"]?.[0].id, "git");
    });

    it("should generate valid config with compact layout", () => {
      const choice: PreviewChoice<string> = {
        name: "Compact",
        value: "compact",
        getConfig: (s, t) => generateCompactLayout(s, t),
      };

      const config = choice.getConfig("compact", "monokai");

      assert.strictEqual(config.version, "1.0.0");
      assert.ok(config.lines["0"]);
      assert.strictEqual(config.lines["0"]?.[0].id, "model");
      // Compact layout only has line 0
      assert.strictEqual(config.lines["1"], undefined);
    });

    it("should pass style parameter to config generator", () => {
      const choice: PreviewChoice<string> = {
        name: "Test",
        value: "test",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      const balancedConfig = choice.getConfig("balanced", "monokai");
      const playfulConfig = choice.getConfig("playful", "monokai");

      assert.strictEqual(balancedConfig.lines["0"]?.[0].style, "balanced");
      assert.strictEqual(playfulConfig.lines["0"]?.[0].style, "playful");
    });

    it("should pass theme parameter to config generator", () => {
      const choice: PreviewChoice<string> = {
        name: "Test",
        value: "test",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      const monokaiConfig = choice.getConfig("balanced", "monokai");
      const nordConfig = choice.getConfig("balanced", "nord");

      assert.ok(monokaiConfig.lines["0"]?.[0].colors);
      assert.ok(nordConfig.lines["0"]?.[0].colors);
      // Different themes should have different color codes
      const monokaiColor = JSON.stringify(monokaiConfig.lines["0"]?.[0].colors);
      const nordColor = JSON.stringify(nordConfig.lines["0"]?.[0].colors);
      assert.notStrictEqual(monokaiColor, nordColor);
    });
  });

  describe("choices structure", () => {
    it("should support array of choices", () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Balanced",
          value: "balanced",
          getConfig: () => generateBalancedLayout("balanced", "monokai"),
        },
        {
          name: "Compact",
          value: "compact",
          getConfig: () => generateCompactLayout("compact", "monokai"),
        },
      ];

      assert.strictEqual(choices.length, 2);
      assert.strictEqual(choices[0].value, "balanced");
      assert.strictEqual(choices[1].value, "compact");
    });

    it("should support choices with descriptions", () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Balanced",
          value: "balanced",
          description: "2-line layout with widgets distributed evenly",
          getConfig: () => generateBalancedLayout("balanced", "monokai"),
        },
        {
          name: "Compact",
          value: "compact",
          description: "Single-line layout with essential widgets",
          getConfig: () => generateCompactLayout("compact", "monokai"),
        },
      ];

      assert.strictEqual(choices.length, 2);
      assert.ok(choices[0].description?.includes("2-line"));
      assert.ok(choices[1].description?.includes("Single-line"));
    });
  });

  describe("generatePreviews", () => {
    it("should generate previews for all choices", async () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Balanced",
          value: "balanced",
          getConfig: () => generateBalancedLayout("balanced", "monokai"),
        },
        {
          name: "Compact",
          value: "compact",
          getConfig: () => generateCompactLayout("compact", "monokai"),
        },
      ];

      const previews = await generatePreviews(choices, "balanced", "monokai");

      assert.strictEqual(previews.length, 2);
      assert.ok(typeof previews[0] === "string");
      assert.ok(typeof previews[1] === "string");
      assert.ok(previews[0].length > 0);
      assert.ok(previews[1].length > 0);
    });

    it("should generate different previews for different layouts", async () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Balanced",
          value: "balanced",
          getConfig: () => generateBalancedLayout("balanced", "monokai"),
        },
        {
          name: "Compact",
          value: "compact",
          getConfig: () => generateCompactLayout("compact", "monokai"),
        },
      ];

      const previews = await generatePreviews(choices, "balanced", "monokai");

      // Previews should be different for different layouts
      assert.notStrictEqual(previews[0], previews[1]);
    });

    it("should handle config generation errors gracefully", async () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Error Choice",
          value: "error",
          getConfig: () => {
            throw new Error("Config generation failed");
          },
        },
      ];

      const previews = await generatePreviews(choices, "balanced", "monokai");

      assert.strictEqual(previews.length, 1);
      assert.ok(previews[0].includes("⚠ Preview error"));
      assert.ok(previews[0].includes("Config generation failed"));
    });

    it("should generate previews with different styles", async () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Balanced",
          value: "balanced",
          getConfig: (s) => generateBalancedLayout(s, "monokai"),
        },
      ];

      const balancedPreviews = await generatePreviews(choices, "balanced", "monokai");
      const playfulPreviews = await generatePreviews(choices, "playful", "monokai");

      // Different styles should produce different previews
      assert.notStrictEqual(balancedPreviews[0], playfulPreviews[0]);
    });

    it("should generate previews with different themes", async () => {
      const choices: PreviewChoice<string>[] = [
        {
          name: "Balanced",
          value: "balanced",
          getConfig: (_, t) => generateBalancedLayout("balanced", t),
        },
      ];

      const monokaiPreviews = await generatePreviews(choices, "balanced", "monokai");
      const draculaPreviews = await generatePreviews(choices, "balanced", "dracula");

      // Both previews should be generated successfully
      assert.strictEqual(monokaiPreviews.length, 1);
      assert.strictEqual(draculaPreviews.length, 1);
      assert.ok(typeof monokaiPreviews[0] === "string");
      assert.ok(typeof draculaPreviews[0] === "string");
      assert.ok(monokaiPreviews[0].length > 0);
      assert.ok(draculaPreviews[0].length > 0);
    });
  });

  describe("config validation", () => {
    it("should generate valid ScopeConfig structure", () => {
      const choice: PreviewChoice<string> = {
        name: "Balanced",
        value: "balanced",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      const config = choice.getConfig("balanced", "monokai");

      // Validate top-level structure
      assert.strictEqual(typeof config.version, "string");
      assert.strictEqual(typeof config.lines, "object");
      assert.ok(Array.isArray(config.lines["0"]));

      // Validate widget config structure
      const widget = config.lines["0"]?.[0];
      assert.strictEqual(typeof widget?.id, "string");
      assert.strictEqual(typeof widget?.style, "string");
      assert.strictEqual(typeof widget?.colors, "object");
    });

    it("should support all required style values", () => {
      const choice: PreviewChoice<string> = {
        name: "Test",
        value: "test",
        getConfig: (s, t) => generateBalancedLayout(s, t),
      };

      const styles = ["balanced", "playful", "compact"] as const;

      styles.forEach((style) => {
        const config = choice.getConfig(style, "monokai");
        assert.strictEqual(config.lines["0"]?.[0].style, style);
      });
    });
  });
});
