import { describe, it } from "node:test";
import assert from "node:assert";
import {
  type StyleRenderer,
  BaseStyleRenderer,
  type RenderData,
} from "../../../src/core/style-renderer.js";

describe("style-renderer", () => {
  describe("StyleRenderer interface", () => {
    it("should define render method signature", () => {
      // Type check - this should compile
      const renderer: StyleRenderer<string> = {
        render: (data: string) => data.toUpperCase(),
      };
      assert.equal(renderer.render("hello"), "HELLO");
    });

    it("should work with generic types", () => {
      interface TestData {
        value: number;
      }
      const renderer: StyleRenderer<TestData> = {
        render: (data: TestData) => `Value: ${data.value}`,
      };
      assert.equal(renderer.render({ value: 42 }), "Value: 42");
    });
  });

  describe("BaseStyleRenderer abstract class", () => {
    it("should require render implementation", () => {
      // This should compile - concrete implementation
      class ConcreteRenderer extends BaseStyleRenderer<string> {
        render(data: string): string {
          return data;
        }
      }

      const renderer = new ConcreteRenderer();
      assert.equal(renderer.render("test"), "test");
    });

    it("should allow custom render logic", () => {
      class UppercaseRenderer extends BaseStyleRenderer<string> {
        render(data: string): string {
          return data.toUpperCase();
        }
      }

      const renderer = new UppercaseRenderer();
      assert.equal(renderer.render("hello"), "HELLO");
    });
  });

  describe("RenderData type", () => {
    it("should accept any data type", () => {
      const data: RenderData = { any: "data" };
      assert.equal(data.any, "data");
    });
  });
});
