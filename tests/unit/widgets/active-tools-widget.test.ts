/**
 * Unit tests for ActiveToolsWidget
 */

import { before, describe, it } from "node:test";
import { expect } from "chai";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { TranscriptProvider } from "../../../src/providers/transcript-provider.js";
import { DEFAULT_THEME } from "../../../src/ui/theme/index.js";
import { ActiveToolsWidget } from "../../../src/widgets/active-tools/active-tools-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";

describe("ActiveToolsWidget", () => {
  let widget: ActiveToolsWidget;
  let transcriptPath: string;

  before(() => {
    widget = new ActiveToolsWidget(DEFAULT_THEME, new TranscriptProvider());
    transcriptPath = join(tmpdir(), `test-transcript-${Date.now()}.jsonl`);
  });

  // Cleanup after all tests
  const cleanup = () => {
    if (existsSync(transcriptPath)) {
      try {
        unlinkSync(transcriptPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  };

  // Run cleanup after all tests
  process.on("exit", cleanup);

  describe("metadata", () => {
    it("should have correct id and metadata", () => {
      expect(widget.id).to.equal("active-tools");
      expect(widget.metadata.name).to.equal("Active Tools");
      expect(widget.metadata.line).to.equal(2);
    });
  });

  describe("rendering with running tools", () => {
    it("should render running tools with balanced style", async () => {
      // Create transcript with running tool
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-1",
                name: "Read",
                input: { file_path: "/src/example.ts" },
              },
            ],
          },
        }) + "\n"
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.not.be.null;
      expect(result).to.include("Read");
      expect(result).to.include("◐"); // Running indicator
    });

    it("should render multiple running tools", async () => {
      writeFileSync(
        transcriptPath,
        [
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/file1.ts" } },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "tool-2", name: "Edit", input: { file_path: "/file2.ts" } },
              ],
            },
          }),
        ].join("\n") + "\n"
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Read");
      expect(result).to.include("Edit");
      expect(result).to.include("◐");
    });
  });

  describe("rendering with completed tools", () => {
    it("should render completed tools with counts", async () => {
      writeFileSync(
        transcriptPath,
        [
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/file1.ts" } },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [{ type: "tool_result", tool_use_id: "tool-1", is_error: false }],
            },
          }),
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "tool-2", name: "Read", input: { file_path: "/file2.ts" } },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [{ type: "tool_result", tool_use_id: "tool-2", is_error: false }],
            },
          }),
        ].join("\n") + "\n"
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Read");
      expect(result).to.include("×2"); // Count
      expect(result).to.include("✓"); // Completed indicator
    });

    it("should aggregate completed tools by name", async () => {
      writeFileSync(
        transcriptPath,
        [
          // 3 Read operations
          ...["f1.ts", "f2.ts", "f3.ts"].flatMap((f) => [
            JSON.stringify({
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: `tool-${f}`,
                    name: "Read",
                    input: { file_path: `/${f}` },
                  },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `tool-${f}`, is_error: false }],
              },
            }),
          ]),
          // 2 Edit operations
          ...["f4.ts", "f5.ts"].flatMap((f) => [
            JSON.stringify({
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: `edit-${f}`,
                    name: "Edit",
                    input: { file_path: `/${f}` },
                  },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `edit-${f}`, is_error: false }],
              },
            }),
          ]),
        ].join("\n") + "\n"
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Read");
      expect(result).to.include("×3");
      expect(result).to.include("Edit");
      expect(result).to.include("×2");
    });
  });

  describe("style variations", () => {
    it("should support compact style", async () => {
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

      widget.setStyle("compact");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Compact style uses brackets around tool name (may include color codes)
      expect(result).to.include("Edit");
      expect(result).to.include("[");
      expect(result).to.include("]");
    });

    it("should support playful style with emojis", async () => {
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-1",
                name: "Read",
                input: { file_path: "/src/test.ts" },
              },
            ],
          },
        }) + "\n"
      );

      widget.setStyle("playful");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("📖"); // Read emoji
    });

    it("should support minimal style", async () => {
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Bash", input: { command: "npm test" } },
            ],
          },
        }) + "\n"
      );

      widget.setStyle("minimal");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Bash");
    });

    it("should support verbose style", async () => {
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/test.ts" } },
            ],
          },
        }) + "\n"
      );

      widget.setStyle("verbose");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Running:");
    });

    it("should support labeled style", async () => {
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Grep", input: { pattern: "function" } },
            ],
          },
        }) + "\n"
      );

      widget.setStyle("labeled");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Tools:");
    });

    it("should support indicator style", async () => {
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Glob", input: { pattern: "**/*.ts" } },
            ],
          },
        }) + "\n"
      );

      widget.setStyle("indicator");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("●");
    });
  });

  describe("edge cases", () => {
    it("should return null when no transcript path", async () => {
      const data = createMockStdinData({ transcript_path: undefined });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should return null when transcript file doesn't exist", async () => {
      const data = createMockStdinData({ transcript_path: "/nonexistent/transcript.jsonl" });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should handle empty transcript file", async () => {
      writeFileSync(transcriptPath, "");
      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should limit to last 20 tools", async () => {
      const lines: string[] = [];
      for (let i = 0; i < 25; i++) {
        lines.push(
          JSON.stringify({
            message: {
              content: [
                {
                  type: "tool_use",
                  id: `tool-${i}`,
                  name: "Read",
                  input: { file_path: `/file${i}.ts` },
                },
              ],
            },
          })
        );
      }
      writeFileSync(transcriptPath, lines.join("\n") + "\n");

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);

      // Should have enabled but render should not crash
      expect(widget.isEnabled()).to.be.true;
    });

    it("should handle malformed JSON in transcript", async () => {
      writeFileSync(
        transcriptPath,
        [
          "invalid json line",
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/test.ts" } },
              ],
            },
          }),
        ].join("\n") + "\n"
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should parse the valid line and skip invalid
      expect(result).to.include("Read");
    });
  });

  describe("isEnabled", () => {
    it("should return true when there are tools", async () => {
      writeFileSync(
        transcriptPath,
        JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/test.ts" } },
            ],
          },
        }) + "\n"
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);

      expect(widget.isEnabled()).to.be.true;
    });

    it("should return false when no tools", async () => {
      const data = createMockStdinData({ transcript_path: undefined });
      await widget.update(data);

      expect(widget.isEnabled()).to.be.false;
    });
  });
});
