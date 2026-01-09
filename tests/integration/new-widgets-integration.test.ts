/**
 * Integration tests for new widgets (CacheMetricsWidget and ActiveToolsWidget)
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { unlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { Renderer } from "../../src/core/renderer.js";
import { TranscriptProvider } from "../../src/providers/transcript-provider.js";
import type { StdinData } from "../../src/types.js";
import { DEFAULT_THEME } from "../../src/ui/theme/index.js";
import { ActiveToolsWidget } from "../../src/widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../../src/widgets/cache-metrics/index.js";
import { createMockStdinData } from "../fixtures/mock-data.js";

describe("New Widgets Integration", () => {
  describe("CacheMetricsWidget", () => {
    it("should work with widget renderer", async () => {
      const widget = new CacheMetricsWidget(DEFAULT_THEME);
      const renderer = new Renderer();

      const data = createMockStdinData({
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 50000,
            output_tokens: 30000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 35000,
          },
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.a("string");
      expect(result).to.include("70%");
      expect(result).to.include("35.0k");
    });

    it("should render on correct line (line 2)", async () => {
      const widget = new CacheMetricsWidget(DEFAULT_THEME);
      expect(widget.metadata.line).to.equal(2);
    });
  });

  describe("ActiveToolsWidget", () => {
    it("should work with widget renderer", async () => {
      const transcriptPath = join(tmpdir(), `test-${Date.now()}.jsonl`);
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-1",
                name: "Read",
                input: { file_path: "/test.ts" },
              },
            ],
          },
        }) + "\n"
      );

      const provider = new TranscriptProvider();
      const widget = new ActiveToolsWidget(DEFAULT_THEME, provider);

      const data = createMockStdinData({
        transcript_path: transcriptPath,
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: null,
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.a("string");
      expect(result).to.include("Read");

      unlinkSync(transcriptPath);
    });

    it("should render on correct line (line 2)", async () => {
      const provider = new TranscriptProvider();
      const widget = new ActiveToolsWidget(DEFAULT_THEME, provider);
      expect(widget.metadata.line).to.equal(2);
    });

    it("should aggregate completed tools with counts", async () => {
      const transcriptPath = join(tmpdir(), `test-${Date.now()}.jsonl`);
      writeFileSync(
        transcriptPath,
        [
          JSON.stringify({
            message: {
              content: [
                {
                  type: "tool_use",
                  id: "tool-1",
                  name: "Read",
                  input: { file_path: "/file1.ts" },
                },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [
                {
                  type: "tool_result",
                  tool_use_id: "tool-1",
                  is_error: false,
                },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [
                {
                  type: "tool_use",
                  id: "tool-2",
                  name: "Read",
                  input: { file_path: "/file2.ts" },
                },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [
                {
                  type: "tool_result",
                  tool_use_id: "tool-2",
                  is_error: false,
                },
              ],
            },
          }),
        ].join("\n") + "\n"
      );

      const provider = new TranscriptProvider();
      const widget = new ActiveToolsWidget(DEFAULT_THEME, provider);

      const data = createMockStdinData({
        transcript_path: transcriptPath,
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: null,
        },
      });

      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.a("string");
      expect(result).to.include("Read");
      expect(result).to.include("×2");

      unlinkSync(transcriptPath);
    });
  });

  describe("Line Assignment", () => {
    it("should assign both new widgets to line 2", () => {
      const cacheWidget = new CacheMetricsWidget(DEFAULT_THEME);
      const toolsWidget = new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider());

      expect(cacheWidget.metadata.line).to.equal(2);
      expect(toolsWidget.metadata.line).to.equal(2);
    });
  });

  describe("Widget Renderer Integration", () => {
    it("should render both widgets together on same line", async () => {
      const transcriptPath = join(tmpdir(), `test-${Date.now()}.jsonl`);
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-1",
                name: "Edit",
                input: { file_path: "/src/test.ts" },
              },
            ],
          },
        }) + "\n"
      );

      const registry = {
        getAllEnabledWidgets: () => [],
        register: async () => {},
      };

      const cacheWidget = new CacheMetricsWidget(DEFAULT_THEME);
      const toolsWidget = new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider());

      const data = createMockStdinData({
        transcript_path: transcriptPath,
        context_window: {
          total_input_tokens: 100000,
          total_output_tokens: 50000,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 50000,
            output_tokens: 30000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 35000,
          },
        },
      });

      await cacheWidget.update(data);
      await toolsWidget.update(data);

      const cacheResult = await cacheWidget.render({
        width: 80,
        timestamp: Date.now(),
      });
      const toolsResult = await toolsWidget.render({
        width: 80,
        timestamp: Date.now(),
      });

      expect(cacheResult).to.be.a("string");
      expect(toolsResult).to.be.a("string");

      unlinkSync(transcriptPath);
    });
  });
});
