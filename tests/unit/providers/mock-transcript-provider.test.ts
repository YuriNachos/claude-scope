/**
 * MockTranscriptProvider Unit Tests
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { MockTranscriptProvider } from "../../../src/providers/mock-transcript-provider.js";

describe("MockTranscriptProvider", () => {
  it("should return 5 demo tools", async () => {
    const provider = new MockTranscriptProvider();
    const tools = await provider.parseTools("/any/path.jsonl");

    assert.strictEqual(tools.length, 5);
  });

  it("should include Read, Edit, and Bash tools", async () => {
    const provider = new MockTranscriptProvider();
    const tools = await provider.parseTools("/any/path.jsonl");

    const toolNames = tools.map((t) => t.name);
    assert.ok(toolNames.includes("Read"), "Should include Read tool");
    assert.ok(toolNames.includes("Edit"), "Should include Edit tool");
    assert.ok(toolNames.includes("Bash"), "Should include Bash tool");
  });

  it("should have one running tool (Bash)", async () => {
    const provider = new MockTranscriptProvider();
    const tools = await provider.parseTools("/any/path.jsonl");

    const running = tools.filter((t) => t.status === "running");
    assert.strictEqual(running.length, 1);
    assert.strictEqual(running[0].name, "Bash");
  });

  it("should have completed tools with endTime", async () => {
    const provider = new MockTranscriptProvider();
    const tools = await provider.parseTools("/any/path.jsonl");

    const completed = tools.filter((t) => t.status === "completed");
    assert.ok(completed.length > 0);

    for (const tool of completed) {
      assert.ok(tool.endTime, "Completed tool should have endTime");
    }
  });

  it("should have tools with realistic targets", async () => {
    const provider = new MockTranscriptProvider();
    const tools = await provider.parseTools("/any/path.jsonl");

    const readTools = tools.filter((t) => t.name === "Read");
    assert.ok(readTools.length > 0);

    for (const tool of readTools) {
      assert.ok(tool.target, "Read tool should have target file path");
      assert.ok(tool.target?.endsWith(".ts"), "Target should be TypeScript file");
    }
  });
});
