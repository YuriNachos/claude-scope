/**
 * Unit tests for ContextWidget
 */

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import { CacheManager } from "../../../src/storage/cache-manager.js";
import type { ContextUsage } from "../../../src/types.js";
import { ContextWidget } from "../../../src/widgets/context-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";
import { matchSnapshot, stripAnsi } from "../../helpers/snapshot.js";

describe("ContextWidget", () => {
  beforeEach(() => {
    // Clear cache before each test to ensure isolation across all tests
    const cacheManager = new CacheManager();
    cacheManager.clearCache();
  });
  it("should have correct id and metadata", () => {
    const widget = new ContextWidget();
    expect(widget.id).to.equal("context");
    expect(widget.metadata.name).to.equal("Context");
  });

  it("should show 0% when current_usage is null (widget always visible)", async () => {
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

    expect(result).to.include("0%");
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

    // ccstatusline formula: input + cache_read + cache_creation (no output_tokens)
    // Calculation: (30000 + 15000 + 5000) / 100000 = 50%
    expect(result).to.include("50%");
    expect(result).to.include("[");
    expect(result).to.include("]");
  });

  it("should use default Monokai color for low usage (< 50%)", async () => {
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

    expect(result).to.include("\x1b[38;2;166;226;46m"); // Monokai green
  });

  it("should use default Monokai color for medium usage (50-79%)", async () => {
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

    expect(result).to.include("\x1b[38;2;253;151;31m"); // Monokai orange
  });

  it("should use default Monokai color for high usage (>= 80%)", async () => {
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

    expect(result).to.include("\x1b[38;2;249;26;114m"); // Monokai pink
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
      const customColors = {
        context: { low: "\x1b[36m", medium: "\x1b[33m", high: "\x1b[31m" },
      };
      const widget = new ContextWidget(customColors as any);
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

    it("should use default Monokai color when no colors provided", async () => {
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

      expect(result).to.include("\x1b[38;2;166;226;46m"); // Monokai green (default)
    });
  });

  describe("style renderers", () => {
    const createContextData = (percent: number) => {
      // ccstatusline formula: input + cache_read + cache_creation (no output_tokens)
      const contextWindowSize = 200000;
      const used = Math.round((percent / 100) * contextWindowSize);
      return {
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: contextWindowSize,
          current_usage: {
            // Distribute used tokens: 70% input, 15% cache_read, 15% cache_creation
            input_tokens: Math.round(used * 0.7),
            output_tokens: Math.round(used * 0.15), // Not counted in context, but present in data
            cache_creation_input_tokens: Math.round(used * 0.15),
            cache_read_input_tokens: Math.round(used * 0.15),
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

        // ccstatusline: input(300) + cache_creation(50) + cache_read(50) = 400 tokens
        // 400 tokens / 10000 = 4%
        expect(stripAnsi(result || "")).to.equal("4% (400/10K)");
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

  describe("cache persistence", () => {
    it("should use cached values when current_usage is null", async () => {
      const widget = new ContextWidget();

      // First update with valid data
      await widget.update(
        createMockStdinData({
          session_id: "test-cache-session",
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 100,
              output_tokens: 50,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 1000,
            },
          },
        })
      );

      const result1 = await widget.render({ width: 80, timestamp: 0 });
      assert.ok(result1);
      const clean1 = stripAnsi(result1 || "");

      // Second update with null current_usage (simulating tool execution)
      await widget.update(
        createMockStdinData({
          session_id: "test-cache-session",
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result2 = await widget.render({ width: 80, timestamp: 0 });
      // Should still render using cached values
      assert.ok(result2);
      const clean2 = stripAnsi(result2 || "");

      // Both should show the same values (from cache)
      expect(clean1).to.equal(clean2);
    });

    it("should show 0% when no cache and current_usage is null (widget always visible)", async () => {
      const widget = new ContextWidget();

      // Update with null current_usage (no cache available for new session)
      await widget.update(
        createMockStdinData({
          session_id: "brand-new-session",
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.include("0%");
    });

    it("should not overwrite cache with zero values", async () => {
      const widget = new ContextWidget();

      // First update with valid data - this should be cached
      await widget.update(
        createMockStdinData({
          session_id: "test-context-zero-jump",
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 75000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result1 = await widget.render({ width: 80, timestamp: 0 });
      assert.ok(result1);
      const clean1 = stripAnsi(result1 || "");
      expect(clean1).to.include("40%"); // (75000 + 5000) / 200000 = 40% (ccstatusline: no output_tokens)

      // Second update with zero values - should NOT overwrite cache
      await widget.update(
        createMockStdinData({
          session_id: "test-context-zero-jump",
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

      // Third update with null current_usage (tool execution scenario)
      await widget.update(
        createMockStdinData({
          session_id: "test-context-zero-jump",
          context_window: {
            total_input_tokens: 0,
            total_output_tokens: 0,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result3 = await widget.render({ width: 80, timestamp: 0 });
      // Should still show 40% from the first update, NOT 0%
      assert.ok(result3);
      const clean3 = stripAnsi(result3 || "");
      expect(clean3).to.include("40%");
      // Note: removed "to.not.include('0%')" check because "40%" contains "0"
    });
  });

  describe("Zero value handling", () => {
    it("should reset cache when session_id changes", async () => {
      const widget = new ContextWidget();

      // First session with valid data - this should be cached
      await widget.update(
        createMockStdinData({
          session_id: "session-alpha",
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 75000,
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      const result1 = await widget.render({ width: 80, timestamp: 0 });
      assert.ok(result1);
      const clean1 = stripAnsi(result1 || "");
      expect(clean1).to.include("40%"); // (75000 + 5000) / 200000 = 40% (ccstatusline: no output_tokens)

      // Second update with different session_id BUT OLD data
      // This simulates what happens when /new is pressed - Claude Code
      // may send the previous session's current_usage with the new session_id
      await widget.update(
        createMockStdinData({
          session_id: "session-beta", // Different session!
          context_window: {
            total_input_tokens: 1000,
            total_output_tokens: 500,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 75000, // OLD data from session-alpha!
              output_tokens: 10000,
              cache_creation_input_tokens: 5000,
              cache_read_input_tokens: 0,
            },
          },
        })
      );

      // Third update with null current_usage (simulating tool execution)
      await widget.update(
        createMockStdinData({
          session_id: "session-beta", // Same session
          context_window: {
            total_input_tokens: 0,
            total_output_tokens: 0,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result3 = await widget.render({ width: 80, timestamp: 0 });
      // FIXED: Session change detection prevents old session data from being cached
      // under the new session_id. Now widget shows 0% instead of null when no data.
      expect(result3).to.include("0%");
    });
  });

  describe("used_percentage fallback behavior", () => {
    it("should use used_percentage when > 0 (Priority 0)", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            used_percentage: 75,
            current_usage: {
              input_tokens: 1000,
              output_tokens: 100,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 0,
            },
            context_window_size: 200000,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      const clean = stripAnsi(result || "");
      // Should use used_percentage directly, not calculate from current_usage
      expect(clean).to.include("75%");
    });

    it("should fallback to current_usage when used_percentage=0 (Priority 1)", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            used_percentage: 0, // Zero triggers fallback
            current_usage: {
              input_tokens: 100000,
              output_tokens: 5000,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 0,
            },
            context_window_size: 200000,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      const clean = stripAnsi(result || "");
      // Should calculate from current_usage, not use used_percentage=0
      // Calculation: 100000 / 200000 = 50%
      expect(clean).to.include("50%");
    });

    it("should fallback to transcript when used_percentage=0 and current_usage=null", async () => {
      const widget = new ContextWidget();

      // First, populate cache with valid data
      await widget.update(
        createMockStdinData({
          session_id: "test-fallback-session",
          transcript_path: "/test/transcript.jsonl",
          context_window: {
            current_usage: {
              input_tokens: 150000,
              output_tokens: 5000,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 0,
            },
            context_window_size: 200000,
          },
        })
      );

      // Then, simulate used_percentage=0 with null current_usage
      await widget.update(
        createMockStdinData({
          session_id: "test-fallback-session",
          transcript_path: "/test/transcript.jsonl",
          context_window: {
            used_percentage: 0,
            current_usage: null,
            context_window_size: 200000,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      const clean = stripAnsi(result || "");
      // Should show cached/transcript value, not 0%
      expect(clean).to.include("75%");
    });

    it("should fallback when used_percentage is undefined", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            // used_percentage not provided (undefined)
            current_usage: {
              input_tokens: 60000,
              output_tokens: 3000,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 0,
            },
            context_window_size: 200000,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      const clean = stripAnsi(result || "");
      // Should calculate from current_usage
      // Calculation: 60000 / 200000 = 30%
      expect(clean).to.include("30%");
    });

    it("should show 0% when all sources are empty", async () => {
      const widget = new ContextWidget();
      await widget.update(
        createMockStdinData({
          session_id: "brand-new-empty-session",
          transcript_path: "/nonexistent/transcript.jsonl",
          context_window: {
            used_percentage: 0,
            current_usage: null,
            context_window_size: 200000,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      const clean = stripAnsi(result || "");
      // No data available anywhere - show 0%
      expect(clean).to.include("0%");
    });
  });
});
