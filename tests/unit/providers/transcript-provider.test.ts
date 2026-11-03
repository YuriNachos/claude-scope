/**
 * Unit tests for TranscriptProvider
 */

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { expect } from "chai";
import { TranscriptProvider } from "../../../src/providers/transcript-provider.js";

describe("TranscriptProvider", () => {
  let provider: TranscriptProvider;
  let tempDir: string;

  before(() => {
    provider = new TranscriptProvider();
    tempDir = mkdtempSync(join(tmpdir(), "transcript-test-"));
  });

  after(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("should parse tool_use blocks and create running tool entries", async () => {
    const transcriptPath = join(tempDir, "transcript.jsonl");
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

    const tools = await provider.parseTools(transcriptPath);

    expect(tools).to.have.lengthOf(1);
    expect(tools[0].id).to.equal("tool-1");
    expect(tools[0].name).to.equal("Read");
    expect(tools[0].target).to.equal("/src/example.ts");
    expect(tools[0].status).to.equal("running");
    expect(tools[0].startTime).to.be.instanceOf(Date);
  });

  it("should match tool_use with tool_result and update status", async () => {
    const transcriptPath = join(tempDir, "transcript.jsonl");
    writeFileSync(
      transcriptPath,
      `${[
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
      ].join("\n")}\n`
    );

    const tools = await provider.parseTools(transcriptPath);

    expect(tools).to.have.lengthOf(1);
    expect(tools[0].status).to.equal("completed");
    expect(tools[0].endTime).to.be.instanceOf(Date);
  });

  it("should set error status when tool_result has is_error=true", async () => {
    const transcriptPath = join(tempDir, "transcript.jsonl");
    writeFileSync(
      transcriptPath,
      `${[
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-1",
                name: "Bash",
                input: { command: "exit 1" },
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
                is_error: true,
              },
            ],
          },
        }),
      ].join("\n")}\n`
    );

    const tools = await provider.parseTools(transcriptPath);

    expect(tools[0].status).to.equal("error");
  });

  it("should extract different targets based on tool type", async () => {
    const transcriptPath = join(tempDir, "transcript.jsonl");
    writeFileSync(
      transcriptPath,
      `${[
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-1",
                name: "Read",
                input: { file_path: "/path/to/file.ts" },
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
                name: "Glob",
                input: { pattern: "**/*.ts" },
              },
            ],
          },
        }),
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-3",
                name: "Grep",
                input: { pattern: "function" },
              },
            ],
          },
        }),
        JSON.stringify({
          message: {
            content: [
              {
                type: "tool_use",
                id: "tool-4",
                name: "Bash",
                input: { command: "npm install very-long-command-name" },
              },
            ],
          },
        }),
      ].join("\n")}\n`
    );

    const tools = await provider.parseTools(transcriptPath);

    expect(tools[0].target).to.equal("/path/to/file.ts");
    expect(tools[1].target).to.equal("**/*.ts");
    expect(tools[2].target).to.equal("function");
    expect(tools[3].target).to.equal("npm install very-long-command-..."); // truncated
  });

  it("should limit tools to last 20 entries", async () => {
    const transcriptPath = join(tempDir, "transcript.jsonl");
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

    const tools = await provider.parseTools(transcriptPath);

    expect(tools).to.have.lengthOf(20);
    expect(tools[0].id).to.equal("tool-5"); // Last 20
    expect(tools[19].id).to.equal("tool-24");
  });

  it("should return empty array for non-existent file", async () => {
    const tools = await provider.parseTools("/non/existent/path.jsonl");
    expect(tools).to.deep.equal([]);
  });

  it("should handle malformed JSON gracefully", async () => {
    const transcriptPath = join(tempDir, "transcript.jsonl");
    writeFileSync(
      transcriptPath,
      `${[
        "invalid json line",
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
        }),
      ].join("\n")}\n`
    );

    const tools = await provider.parseTools(transcriptPath);

    expect(tools).to.have.lengthOf(1);
    expect(tools[0].id).to.equal("tool-1");
  });

  describe("api-request-blob lines", () => {
    // Claude Code logs the outgoing API request as an `api-request-blob` line,
    // which replays earlier tool_use/tool_result blocks. A replay is history,
    // not a new tool call.
    const toolUse = (id: string) => ({
      type: "assistant",
      message: { role: "assistant", content: [{ type: "tool_use", id, name: "Read" }] },
    });
    const toolResult = (id: string) => ({
      type: "user",
      message: { role: "user", content: [{ type: "tool_result", tool_use_id: id }] },
    });
    const blob = (ids: string[]) => ({
      type: "api-request-blob",
      message: {
        role: "user",
        content: ids.map((id) => ({ type: "tool_use", id, name: "Read" })),
      },
    });

    it("should not reset a completed tool to running when it is replayed", async () => {
      const transcriptPath = join(tempDir, "transcript.jsonl");
      const lines = [toolUse("a"), toolResult("a"), toolUse("b"), blob(["a"])];
      writeFileSync(transcriptPath, `${lines.map((l) => JSON.stringify(l)).join("\n")}\n`);

      const tools = await provider.parseTools(transcriptPath);

      expect(tools.map((t) => [t.id, t.status])).to.deep.equal([
        ["a", "completed"],
        ["b", "running"],
      ]);
    });

    it("should not let replays in a tail window stand in for the real tools", async () => {
      // The real tool calls sit before a padding line larger than the first
      // tail window; a replay of some of them sits inside it.
      const transcriptPath = join(tempDir, "transcript.jsonl");
      const lines: object[] = [];
      for (let i = 0; i < 25; i++) {
        lines.push(toolUse(`tool-${i}`), toolResult(`tool-${i}`));
      }
      lines.push({ type: "assistant", message: { content: "x".repeat(2.5 * 1024 * 1024) } });
      lines.push(blob(Array.from({ length: 20 }, (_, i) => `tool-${i}`)));
      lines.push(toolUse("tool-new"));
      writeFileSync(transcriptPath, `${lines.map((l) => JSON.stringify(l)).join("\n")}\n`);

      const tools = await provider.parseTools(transcriptPath);

      expect(tools).to.have.lengthOf(20);
      expect(tools[0].id).to.equal("tool-6");
      expect(tools[18]).to.include({ id: "tool-24", status: "completed" });
      expect(tools[19]).to.include({ id: "tool-new", status: "running" });
    });
  });
});
