/**
 * Unit tests for ContextWidget
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import type { ContextUsage } from "../../../src/types.js";
import { ContextWidget } from "../../../src/widgets/context-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";
import { matchSnapshot, stripAnsi } from "../../helpers/snapshot.js";

describe("ContextWidget", () => {
  it("should have correct id and metadata", () => {
    const widget = new ContextWidget();
    expect(widget.id).to.equal("context");
    expect(widget.metadata.name).to.equal("Context");
  });

  it("should return null when current_usage is null", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: null as unknown as ContextUsage,
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it("should calculate usage with cache tokens", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 100000,
          current_usage: {
            input_tokens: 30000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 15000,
          },
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Calculation: (30000 + 10000 + 5000 + 15000) / 100000 = 60%
    // cache_read_input_tokens (15000) IS counted - they occupy context space
    expect(result).to.include("60%");
    expect(result).to.include("[");
    expect(result).to.include("]");
  });

  it("should use default gray color for low usage (< 50%)", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 40000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 0,
          },
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include("\x1b[90m"); // Gray ANSI code (default)
  });

  it("should use default gray color for medium usage (50-79%)", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 100000,
          current_usage: {
            input_tokens: 60000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 0,
          },
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include("\x1b[90m"); // Gray ANSI code (default)
  });

  it("should use default gray color for high usage (>= 80%)", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 100000,
          current_usage: {
            input_tokens: 75000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 0,
          },
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include("\x1b[90m"); // Gray ANSI code (default)
  });

  it("should handle 0% usage", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 0,
          total_output_tokens: 0,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 0,
            output_tokens: 0,
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0,
          },
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include("0%");
  });

  it("should handle 100% usage", async () => {
    const widget = new ContextWidget();
    await widget.update(
      createMockStdinData({
        context_window: {
          total_input_tokens: 200000,
          total_output_tokens: 0,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 200000,
            output_tokens: 0,
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0,
          },
        },
      })
    );

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include("100%");
  });

  describe("snapshots", () => {
    it("should snapshot low usage output (gray)", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 40000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot("context-widget-low-usage", stripAnsi(result || ""));
    });

    it("should snapshot medium usage output (gray)", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 100000,
            current_usage: {
              input_tokens: 60000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot("context-widget-medium-usage", stripAnsi(result || ""));
    });

    it("should snapshot high usage output (gray)", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 100000,
            current_usage: {
              input_tokens: 75000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot("context-widget-high-usage", stripAnsi(result || ""));
    });
  });

  describe("with custom colors", () => {
    it("should use custom low color when provided", async () => {
      const customColors = { low: "\x1b[36m", medium: "\x1b[33m", high: "\x1b[31m" };
      const widget = new ContextWidget(customColors);
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 40000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("\x1b[36m"); // Cyan (custom low color)
    });

    it("should use default gray color when no colors provided", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 40000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("\x1b[90m"); // Gray (default)
    });
  });

  describe("style renderers", () => {
    const createContextData = (percent: number) => {
      // Calculate tokens to achieve desired percent
      const contextWindowSize = 200000;
      const used = Math.round((percent / 100) * contextWindowSize);
      return {
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: contextWindowSize,
          current_usage: {
            input_tokens: Math.round(used * 0.6),
            output_tokens: Math.round(used * 0.2),
            cache_creation_input_tokens: Math.round(used * 0.1),
            cache_read_input_tokens: Math.round(used * 0.1),
          },
        },
      };
    };

    describe("balanced style", () => {
      it("should render with progress bar and percent", async () => {
        const widget = new ContextWidget();
        widget.setStyle("balanced");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("[███████░░░] 71%");
      });
    });

    describe("compact style", () => {
      it("should render only percent", async () => {
        const widget = new ContextWidget();
        widget.setStyle("compact");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("71%");
      });
    });

    describe("playful style", () => {
      it("should render with brain emoji and progress bar", async () => {
        const widget = new ContextWidget();
        widget.setStyle("playful");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("🧠 [███████░░░] 71%");
      });
    });

    describe("verbose style", () => {
      it("should render with full token counts and label", async () => {
        const widget = new ContextWidget();
        widget.setStyle("verbose");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        // 71% of 200000 = 142000
        expect(stripAnsi(result || "")).to.equal("142,000 / 200,000 tokens (71%)");
      });
    });

    describe("symbolic style", () => {
      it("should render with symbolic progress bar", async () => {
        const widget = new ContextWidget();
        widget.setStyle("symbolic");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        // 71% of 5 chars = ~3.55, round to 4 filled
        expect(stripAnsi(result || "")).to.equal("▮▮▮▮▯ 71%");
      });

      it("should render correct symbolic bars at different percentages", async () => {
        const widget = new ContextWidget();
        widget.setStyle("symbolic");

        // Test 0% - all empty
        await widget.update(createMockStdinData(createContextData(0)));
        const result0 = await widget.render({ width: 80, timestamp: 0 });
        expect(stripAnsi(result0 || "")).to.equal("▯▯▯▯▯ 0%");

        // Test 50% - half filled
        await widget.update(createMockStdinData(createContextData(50)));
        const result50 = await widget.render({ width: 80, timestamp: 0 });
        expect(stripAnsi(result50 || "")).to.equal("▮▮▮▯▯ 50%");

        // Test 100% - all filled
        await widget.update(createMockStdinData(createContextData(100)));
        const result100 = await widget.render({ width: 80, timestamp: 0 });
        expect(stripAnsi(result100 || "")).to.equal("▮▮▮▮▮ 100%");
      });
    });

    describe("compact-verbose style", () => {
      it("should render with K-formatted token counts", async () => {
        const widget = new ContextWidget();
        widget.setStyle("compact-verbose");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        // 71% of 200000 = 142000, formatted as 142K
        expect(stripAnsi(result || "")).to.equal("71% (142K/200K)");
      });

      it("should format token counts correctly under 1000", async () => {
        const widget = new ContextWidget();
        widget.setStyle("compact-verbose");

        // Use small context window to get < 1000 tokens
        const smallContextData = {
          context_window: {
            total_input_tokens: 100,
            total_output_tokens: 50,
            context_window_size: 10000,
            current_usage: {
              input_tokens: 300,
              output_tokens: 100,
              cache_creation_input_tokens: 50,
              cache_read_input_tokens: 50,
            },
          },
        };

        await widget.update(createMockStdinData(smallContextData));
        const result = await widget.render({ width: 80, timestamp: 0 });

        // 500 tokens / 10000 = 5%
        expect(stripAnsi(result || "")).to.equal("5% (500/10K)");
      });
    });

    describe("indicator style", () => {
      it("should render with bullet indicator", async () => {
        const widget = new ContextWidget();
        widget.setStyle("indicator");
        await widget.update(createMockStdinData(createContextData(71)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("● 71%");
      });
    });

    describe("style switching", () => {
      it("should switch between styles dynamically", async () => {
        const widget = new ContextWidget();
        await widget.update(createMockStdinData(createContextData(71)));

        widget.setStyle("balanced");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "[███████░░░] 71%"
        );

        widget.setStyle("compact");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal("71%");

        widget.setStyle("verbose");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "142,000 / 200,000 tokens (71%)"
        );
      });

      it("should default to balanced for unknown styles", async () => {
        const widget = new ContextWidget();
        await widget.update(createMockStdinData(createContextData(71)));

        // @ts-expect-error - testing invalid style
        widget.setStyle("unknown" as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("[███████░░░] 71%");
      });
    });
  });
});
