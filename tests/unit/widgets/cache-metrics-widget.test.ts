/**
 * Unit tests for CacheMetricsWidget
 */

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { expect } from "chai";
import { CacheManager } from "../../../src/storage/cache-manager.js";
import { DEFAULT_THEME } from "../../../src/ui/theme/index.js";
import { CacheMetricsWidget } from "../../../src/widgets/cache-metrics/cache-metrics-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";

describe("CacheMetricsWidget", () => {
  beforeEach(() => {
    // Clear cache before each test to ensure isolation
    const cacheManager = new CacheManager();
    cacheManager.clearCache();
  });

  describe("metadata", () => {
    it("should have correct id and metadata", () => {
      const widget = new CacheMetricsWidget();
      expect(widget.id).to.equal("cache-metrics");
      expect(widget.metadata.name).to.equal("Cache Metrics");
      expect(widget.metadata.line).to.equal(2);
    });
  });

  describe("rendering with cache data", () => {
    it("should render cache hit rate with default balanced style", async () => {
      const widget = new CacheMetricsWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 35000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.not.be.null;
      // New calculation: 35000 / (35000 + 5000 + 50000) = 35000 / 90000 = 38.89% → 39%
      expect(result).to.include("39%");
      expect(result).to.include("35k");
      expect(result).to.include("tokens");
    });

    it("should return null when no context usage data available", async () => {
      const widget = new CacheMetricsWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should support compact style", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("compact");
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 35000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Cache: 39%");
    });

    it("should support breakdown style with multiple lines", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("breakdown");
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 35000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("\n");
      expect(result).to.include("├─ Read:");
      expect(result).to.include("└─ Write:");
    });

    it("should handle zero cache values", async () => {
      const widget = new CacheMetricsWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 0,
              cache_creation_input_tokens: 0,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("0%");
    });

    it("should calculate cost savings correctly", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("verbose");
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 35000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      // 35000 * 0.9 * 0.000003 = 0.0945
      expect(result).to.include("$0.09");
    });
  });

  describe("color coding", () => {
    it("should use high color for hit rate > 70%", async () => {
      const widget = new CacheMetricsWidget(DEFAULT_THEME);
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 10000,
              output_tokens: 30000,
              cache_read_input_tokens: 70000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Check for high color (green in default theme)
      // hitRate = 70000 / (70000 + 5000 + 10000) = 70000 / 85000 = 82.35% → HIGH
      expect(result).to.include(DEFAULT_THEME.cache.high);
    });

    it("should use medium color for hit rate 40-70%", async () => {
      const widget = new CacheMetricsWidget(DEFAULT_THEME);
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 30000,
              output_tokens: 30000,
              cache_read_input_tokens: 40000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      // hitRate = 40000 / (40000 + 5000 + 30000) = 40000 / 75000 = 53.33% → MEDIUM
      expect(result).to.include(DEFAULT_THEME.cache.medium);
    });

    it("should use low color for hit rate < 40%", async () => {
      const widget = new CacheMetricsWidget(DEFAULT_THEME);
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 10000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include(DEFAULT_THEME.cache.low);
    });
  });

  describe("style variations", () => {
    const createContextData = (hitRate: number) => {
      const cacheWrite = 5000;
      const cacheRead = Math.round((hitRate / 100) * 90000); // Total will be ~90k
      const inputTokens = 90000 - cacheRead - cacheWrite; // Adjust to get desired hit rate
      return {
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: Math.max(0, inputTokens),
            output_tokens: 30000,
            cache_read_input_tokens: cacheRead,
            cache_creation_input_tokens: cacheWrite,
          },
        },
      };
    };

    it("should render playful style with progress bar", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("playful");
      await widget.update(createMockStdinData(createContextData(70)));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("💾");
      expect(result).to.include("[");
      expect(result).to.include("]");
    });

    it("should render verbose style with full details", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("verbose");
      await widget.update(createMockStdinData(createContextData(70)));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Cache:");
      expect(result).to.include("tokens");
      expect(result).to.include("saved");
    });

    it("should render labeled style with labels", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("labeled");
      await widget.update(createMockStdinData(createContextData(70)));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Cache Hit:");
    });

    it("should render indicator style with bullet", async () => {
      const widget = new CacheMetricsWidget();
      widget.setStyle("indicator");
      await widget.update(createMockStdinData(createContextData(70)));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("●");
    });
  });

  describe("isEnabled", () => {
    it("should return true when renderData exists", async () => {
      const widget = new CacheMetricsWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 35000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      expect(widget.isEnabled()).to.be.true;
    });

    it("should return false when no renderData", async () => {
      const widget = new CacheMetricsWidget();
      await widget.update(
        createMockStdinData({
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      expect(widget.isEnabled()).to.be.false;
    });
  });

  describe("cache hit rate calculation bug fixes", () => {
    it("should calculate hit rate correctly with mixed token types", async () => {
      // Real-world scenario: large cache, small new tokens
      const widget = new CacheMetricsWidget();
      const data = createMockStdinData({
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 27, // Only NEW tokens
            output_tokens: 30000,
            cache_read_input_tokens: 140000, // Large cache read
            cache_creation_input_tokens: 5000,
          },
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should be ~97%, not 520059%
      // Calculation: 140000 / (140000 + 5000 + 27) = 140000 / 145027 = 96.54% → rounds to 97%
      expect(result).to.contain("97%");
      expect(result).not.to.contain("520059%");
    });

    it("should handle 100% cache hit rate", async () => {
      const widget = new CacheMetricsWidget();
      const data = createMockStdinData({
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 0, // No new tokens
            output_tokens: 30000,
            cache_read_input_tokens: 50000, // All from cache
            cache_creation_input_tokens: 0,
          },
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.contain("100%");
    });

    it("should handle 0% cache hit rate", async () => {
      const widget = new CacheMetricsWidget();
      const data = createMockStdinData({
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 50000, // All new tokens
            output_tokens: 30000,
            cache_read_input_tokens: 0,
            cache_creation_input_tokens: 0,
          },
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.contain("0%");
    });

    it("should cap hit rate at 100%", async () => {
      const widget = new CacheMetricsWidget();
      const data = createMockStdinData({
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 0, // No new tokens
            output_tokens: 30000,
            cache_read_input_tokens: 50000, // All from cache
            cache_creation_input_tokens: 0, // No cache write
          },
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should be exactly 100%, not more
      // Calculation: 50000 / (50000 + 0 + 0) = 50000 / 50000 = 100%
      expect(result).to.contain("100%");
      expect(result).not.to.contain("101%");
    });
  });

  describe("cache persistence", () => {
    it("should use cached values when current_usage is null", async () => {
      const widget = new CacheMetricsWidget();

      // First update with valid data
      await widget.update(
        createMockStdinData({
          session_id: "test-cache-session",
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
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
      expect(result1).to.not.be.null;
      expect(result1).to.include("1.0k"); // formatK converts 1000 to "1.0k"

      // Second update with null current_usage (simulating tool execution)
      await widget.update(
        createMockStdinData({
          session_id: "test-cache-session",
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result2 = await widget.render({ width: 80, timestamp: 0 });
      // Should still render using cached values
      expect(result2).to.not.be.null;
      expect(result2).to.include("1.0k");
    });

    it("should return null when no cache and current_usage is null", async () => {
      const widget = new CacheMetricsWidget();

      await widget.update(
        createMockStdinData({
          session_id: "brand-new-session",
          context_window: {
            total_input_tokens: 100000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: null,
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.be.null;
    });
  });
});
