import { describe, it } from "node:test";
import { expect } from "chai";
import { Renderer } from "../../../src/core/renderer.js";

describe("Renderer", () => {
  describe("setSeparator", () => {
    it("should have default separator of single space", async () => {
      const renderer = new Renderer();
      const widget1 = {
        id: "test1",
        metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "A",
        update: async () => {},
        isEnabled: () => true,
      };
      const widget2 = {
        id: "test2",
        metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "B",
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.equal("A B");
    });

    it("should change separator when setSeparator is called", async () => {
      const renderer = new Renderer();
      renderer.setSeparator(" │ ");

      const widget1 = {
        id: "test1",
        metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "A",
        update: async () => {},
        isEnabled: () => true,
      };
      const widget2 = {
        id: "test2",
        metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "B",
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.equal("A │ B");
    });

    it("should allow changing separator multiple times", async () => {
      const renderer = new Renderer();
      const widget1 = {
        id: "test1",
        metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "X",
        update: async () => {},
        isEnabled: () => true,
      };
      const widget2 = {
        id: "test2",
        metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "Y",
        update: async () => {},
        isEnabled: () => true,
      };

      renderer.setSeparator(" | ");
      let lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      let result = lines.join("\n");
      expect(result).to.equal("X | Y");

      renderer.setSeparator(" /// ");
      lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      result = lines.join("\n");
      expect(result).to.equal("X /// Y");

      renderer.setSeparator("");
      lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      result = lines.join("\n");
      expect(result).to.equal("XY");
    });

    it("should handle multi-character separators", async () => {
      const renderer = new Renderer();
      renderer.setSeparator(" *** ");

      const widget1 = {
        id: "test1",
        metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "First",
        update: async () => {},
        isEnabled: () => true,
      };
      const widget2 = {
        id: "test2",
        metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "Second",
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.equal("First *** Second");
    });

    it("should handle special characters in separator", async () => {
      const renderer = new Renderer();
      renderer.setSeparator("\u2503\u2503"); // Double box drawing character

      const widget1 = {
        id: "test1",
        metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "L",
        update: async () => {},
        isEnabled: () => true,
      };
      const widget2 = {
        id: "test2",
        metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "R",
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.include("\u2503\u2503");
    });
  });

  describe("render", () => {
    it("should render single widget output", async () => {
      const renderer = new Renderer();
      const mockWidget = {
        id: "test",
        metadata: { name: "Test", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "test output",
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([mockWidget as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.include("test output");
    });

    it("should render multiple widgets on one line", async () => {
      const renderer = new Renderer();
      const widget1 = {
        id: "test1",
        metadata: { name: "Test1", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "output1",
        update: async () => {},
        isEnabled: () => true,
      };
      const widget2 = {
        id: "test2",
        metadata: { name: "Test2", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "output2",
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([widget1 as any, widget2 as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.include("output1");
      expect(result).to.include("output2");
    });

    it("should skip disabled widgets", async () => {
      const renderer = new Renderer();
      const disabledWidget = {
        id: "disabled",
        metadata: { name: "Disabled", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => "should not see",
        update: async () => {},
        isEnabled: () => false,
      };

      const lines = await renderer.render([disabledWidget as any], {
        width: 80,
        timestamp: Date.now(),
      });
      const result = lines.join("\n");

      expect(result).to.not.include("should not see");
    });

    it("should skip widgets that return null", async () => {
      const renderer = new Renderer();
      const nullWidget = {
        id: "null",
        metadata: { name: "Null", description: "Test", version: "1.0.0", author: "Test" },
        initialize: async () => {},
        render: async () => null,
        update: async () => {},
        isEnabled: () => true,
      };

      const lines = await renderer.render([nullWidget as any], {
        width: 80,
        timestamp: Date.now(),
      });

      expect(lines).to.deep.equal([]);
    });
  });
});
