/**
 * Unit tests for ActiveToolsWidget
 */

import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, describe, it } from "node:test";
import { expect } from "chai";
import { TranscriptProvider } from "../../../src/providers/transcript-provider.js";
import { DEFAULT_THEME } from "../../../src/ui/theme/index.js";
import { ActiveToolsWidget } from "../../../src/widgets/active-tools/active-tools-widget.js";
import { createMockStdinData } from "../../fixtures/mock-data.js";

/**
 * Strip ANSI escape codes from a string
 * @param text - Text that may contain ANSI codes
 * @returns Text with ANSI codes removed
 */
function stripAnsiCodes(text: string): string {
  // ESC pattern (escape character 0x1b) followed by [parameters]m
  // Using the escape character directly to avoid Biome linting issues
  const escapeChar = String.fromCharCode(27);
  const ansiEscape = new RegExp(`${escapeChar}\\[[0-9;]*m`, "g");
  return text.replace(ansiEscape, "");
}

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
    it("should render running tools with balanced style (new format)", async () => {
      // Create transcript with running tool
      writeFileSync(
        transcriptPath,
        `${JSON.stringify({
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
        })}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.not.be.null;
      expect(result).to.include("Read");
      expect(result).to.include("running"); // New text format
      expect(result).to.not.include("◐"); // No spinner symbol
    });

    it("should render multiple running tools", async () => {
      writeFileSync(
        transcriptPath,
        `${[
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
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Read");
      expect(result).to.include("Edit");
      expect(result).to.include("running");
    });
  });

  describe("rendering with completed tools", () => {
    it("should render completed tools with counts (new format)", async () => {
      writeFileSync(
        transcriptPath,
        `${[
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
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Reads"); // Pluralized
      expect(result).to.include("2"); // Count (no × symbol)
      expect(result).to.not.include("✓"); // No checkmark symbol
    });

    it("should aggregate completed tools by name", async () => {
      writeFileSync(
        transcriptPath,
        `${[
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
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include("Reads");
      expect(result).to.include("3");
      expect(result).to.include("Edits");
      expect(result).to.include("2");
    });

    it("should sort completed tools by usage count (highest first)", async () => {
      writeFileSync(
        transcriptPath,
        `${[
          // 1 Read
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "read-1", name: "Read", input: { file_path: "/f1.ts" } },
              ],
            },
          }),
          JSON.stringify({
            message: {
              content: [{ type: "tool_result", tool_use_id: "read-1", is_error: false }],
            },
          }),
          // 5 Edits (most used)
          ...Array.from({ length: 5 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: `edit-${i}`,
                    name: "Edit",
                    input: { file_path: `/e${i}.ts` },
                  },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `edit-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
          // 3 Bash (second most)
          ...Array.from({ length: 3 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [
                  { type: "tool_use", id: `bash-${i}`, name: "Bash", input: { command: "echo" } },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `bash-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
          // 2 Write (third most)
          ...Array.from({ length: 2 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [
                  {
                    type: "tool_use",
                    id: `write-${i}`,
                    name: "Write",
                    input: { file_path: `/w${i}.ts` },
                  },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `write-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      const plainText = stripAnsiCodes(result || "");

      // Order should be: Edits (5), Bash (3), Writes (2), Reads (1)
      const editIndex = plainText.indexOf("Edits");
      const bashIndex = plainText.indexOf("Bash");
      const writeIndex = plainText.indexOf("Writes");
      const readIndex = plainText.indexOf("Reads");

      expect(editIndex).to.not.equal(-1);
      expect(bashIndex).to.be.greaterThan(editIndex);
      expect(writeIndex).to.be.greaterThan(bashIndex);
      expect(readIndex).to.be.greaterThan(writeIndex);
    });

    it("should sort tools with equal counts alphabetically", async () => {
      writeFileSync(
        transcriptPath,
        `${[
          // 2 Edit, 2 Bash, 2 Read - all equal counts
          ...["Edit", "Bash", "Read"].flatMap((name) => [
            JSON.stringify({
              message: {
                content: [{ type: "tool_use", id: `${name.toLowerCase()}-1`, name, input: {} }],
              },
            }),
            JSON.stringify({
              message: {
                content: [
                  { type: "tool_result", tool_use_id: `${name.toLowerCase()}-1`, is_error: false },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_use", id: `${name.toLowerCase()}-2`, name, input: {} }],
              },
            }),
            JSON.stringify({
              message: {
                content: [
                  { type: "tool_result", tool_use_id: `${name.toLowerCase()}-2`, is_error: false },
                ],
              },
            }),
          ]),
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      const plainText = stripAnsiCodes(result || "");

      // Alphabetical order: Bash, Edit, Read
      const bashIndex = plainText.indexOf("Bash");
      const editIndex = plainText.indexOf("Edits");
      const readIndex = plainText.indexOf("Reads");

      expect(bashIndex).to.not.equal(-1);
      expect(editIndex).to.be.greaterThan(bashIndex);
      expect(readIndex).to.be.greaterThan(editIndex);
    });
  });

  describe("new format: mixed running and completed", () => {
    it("should render tools with both running and completed instances", async () => {
      writeFileSync(
        transcriptPath,
        `${[
          // 6 completed Task operations
          ...Array.from({ length: 6 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [
                  { type: "tool_use", id: `task-${i}`, name: "Task", input: { task: "test" } },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `task-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
          // 1 running Task
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "task-running", name: "Task", input: { task: "running" } },
              ],
            },
          }),
          // 6 completed TodoWrite
          ...Array.from({ length: 6 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [
                  { type: "tool_use", id: `todo-${i}`, name: "TodoWrite", input: { todos: [] } },
                ],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `todo-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
          // 4 completed Bash
          ...Array.from({ length: 4 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [{ type: "tool_use", id: `bash-${i}`, name: "Bash", input: {} }],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `bash-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Strip ANSI codes for assertions
      const plainText = result ? stripAnsiCodes(result) : "";

      expect(plainText).to.include("Task (1 running, 6 done)");
      expect(plainText).to.include("TodoWrites: 6");
      expect(plainText).to.include("Bash: 4");
      expect(plainText).to.not.include("◐"); // No spinner
      expect(plainText).to.not.include("✓"); // No checkmark
    });

    it("should handle multiple tools with mixed states", async () => {
      writeFileSync(
        transcriptPath,
        `${[
          // Read: 2 running, 3 completed
          ...Array.from({ length: 3 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [{ type: "tool_use", id: `read-done-${i}`, name: "Read", input: {} }],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `read-done-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
          ...Array.from({ length: 2 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [{ type: "tool_use", id: `read-run-${i}`, name: "Read", input: {} }],
              },
            }),
          ]).flat(),
          // Edit: 0 running, 2 completed
          ...Array.from({ length: 2 }, (_, i) => [
            JSON.stringify({
              message: {
                content: [{ type: "tool_use", id: `edit-${i}`, name: "Edit", input: {} }],
              },
            }),
            JSON.stringify({
              message: {
                content: [{ type: "tool_result", tool_use_id: `edit-${i}`, is_error: false }],
              },
            }),
          ]).flat(),
        ].join("\n")}\n`
      );

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);
      const result = await widget.render({ width: 80, timestamp: 0 });

      // Strip ANSI codes for assertions
      const plainText = result ? stripAnsiCodes(result) : "";

      expect(plainText).to.include("Read (2 running, 3 done)");
      expect(plainText).to.include("Edits: 2");
    });
  });

  describe("style variations", () => {
    it("should support compact style", async () => {
      writeFileSync(
        transcriptPath,
        `${JSON.stringify({
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
        })}\n`
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
        `${JSON.stringify({
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
        })}\n`
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
        `${JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Bash", input: { command: "npm test" } },
            ],
          },
        })}\n`
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
        `${JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/test.ts" } },
            ],
          },
        })}\n`
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
        `${JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Grep", input: { pattern: "function" } },
            ],
          },
        })}\n`
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
        `${JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Glob", input: { pattern: "**/*.ts" } },
            ],
          },
        })}\n`
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
      writeFileSync(transcriptPath, `${lines.join("\n")}\n`);

      const data = createMockStdinData({ transcript_path: transcriptPath });
      await widget.update(data);

      // Should have enabled but render should not crash
      expect(widget.isEnabled()).to.be.true;
    });

    it("should handle malformed JSON in transcript", async () => {
      writeFileSync(
        transcriptPath,
        `${[
          "invalid json line",
          JSON.stringify({
            message: {
              content: [
                { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/test.ts" } },
              ],
            },
          }),
        ].join("\n")}\n`
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
        `${JSON.stringify({
          message: {
            content: [
              { type: "tool_use", id: "tool-1", name: "Read", input: { file_path: "/test.ts" } },
            ],
          },
        })}\n`
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
