/**
 * Unit tests for CacheMetricsWidget
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { DEFAULT_THEME } from "../../../src/ui/theme/index.js";
import { CacheMetricsWidget } from "../../../src/widgets/cache-metrics/cache-metrics-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";

describe("CacheMetricsWidget", () => {
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
      expect(result).to.include("70%");
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

      expect(result).to.include("Cache: 70%");
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
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 40000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Check for high color (green in default theme)
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
              input_tokens: 50000,
              output_tokens: 30000,
              cache_read_input_tokens: 20000,
              cache_creation_input_tokens: 5000,
            },
          },
        })
      );

      const result = await widget.render({ width: 80, timestamp: 0 });

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
      const inputTokens = 50000;
      const cacheRead = Math.round((hitRate / 100) * inputTokens);
      return {
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: inputTokens,
            output_tokens: 30000,
            cache_read_input_tokens: cacheRead,
            cache_creation_input_tokens: 5000,
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
});
