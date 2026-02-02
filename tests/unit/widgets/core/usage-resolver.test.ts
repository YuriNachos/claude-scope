import assert from "node:assert";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, it } from "node:test";
import type { StdinData } from "../../../../src/types.js";
import { UsageResolver } from "../../../../src/widgets/core/usage-resolver.js";

describe("UsageResolver", () => {
  const testDir = join(tmpdir(), "usage-resolver-test");
  let resolver: UsageResolver;

  // Create test directory
  try {
    mkdirSync(testDir, { recursive: true });
  } catch {}

  beforeEach(() => {
    resolver = new UsageResolver();
  });

  describe("resolve", () => {
    it("should return null usage when no data available", async () => {
      const data: StdinData = {
        hook_event_name: "prompt_submit" as const,
        model: { id: "test", display_name: "Test" },
        cwd: "/test",
        session_id: "session-1",
      };

      const result = await resolver.resolve(data);
      assert.strictEqual(result.usage, null);
      assert.strictEqual(result.sessionChanged, false);
    });

    it("should return current_usage when available", async () => {
      const data: StdinData = {
        hook_event_name: "prompt_submit" as const,
        model: { id: "test", display_name: "Test" },
        cwd: "/test",
        session_id: "session-1",
        context_window: {
          current_usage: {
            input_tokens: 1000,
            output_tokens: 500,
            cache_creation_input_tokens: 100,
            cache_read_input_tokens: 200,
          },
        },
      };

      const result = await resolver.resolve(data);
      assert.deepStrictEqual(result.usage, {
        input_tokens: 1000,
        output_tokens: 500,
        cache_creation_input_tokens: 100,
        cache_read_input_tokens: 200,
      });
      assert.strictEqual(result.sessionChanged, false);
    });

    it("should detect session change", async () => {
      const data1: StdinData = {
        hook_event_name: "prompt_submit" as const,
        model: { id: "test", display_name: "Test" },
        cwd: "/test",
        session_id: "session-1",
        context_window: {
          current_usage: {
            input_tokens: 1000,
            output_tokens: 500,
          },
        },
      };

      const data2: StdinData = {
        hook_event_name: "prompt_submit" as const,
        model: { id: "test", display_name: "Test" },
        cwd: "/test",
        session_id: "session-2",
        context_window: {
          current_usage: {
            input_tokens: 500,
            output_tokens: 250,
          },
        },
      };

      // First call - no session change
      const result1 = await resolver.resolve(data1);
      assert.strictEqual(result1.sessionChanged, false);

      // Second call with different session - session changed
      const result2 = await resolver.resolve(data2);
      assert.strictEqual(result2.sessionChanged, true);
    });

    it("should read from transcript when current_usage is null", async () => {
      const filePath = join(testDir, "transcript.jsonl");
      const transcriptLine = JSON.stringify({
        type: "assistant",
        message: {
          usage: {
            input_tokens: 2000,
            output_tokens: 1000,
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0,
          },
        },
      });
      writeFileSync(filePath, `${transcriptLine}\n`);

      const data: StdinData = {
        hook_event_name: "prompt_submit" as const,
        model: { id: "test", display_name: "Test" },
        cwd: "/test",
        session_id: "session-1",
        transcript_path: filePath,
      };

      const result = await resolver.resolve(data);
      assert.strictEqual(result.usage?.input_tokens, 2000);
      assert.strictEqual(result.usage?.output_tokens, 1000);

      unlinkSync(filePath);
    });
  });

  describe("getCumulativeCache", () => {
    it("should return null for undefined path", async () => {
      const result = await resolver.getCumulativeCache(undefined);
      assert.strictEqual(result, null);
    });

    it("should parse cumulative cache from transcript", async () => {
      const filePath = join(testDir, "cache-transcript.jsonl");
      const lines = [
        JSON.stringify({
          type: "assistant",
          message: {
            usage: {
              input_tokens: 1000,
              output_tokens: 500,
              cache_creation_input_tokens: 100,
              cache_read_input_tokens: 500,
            },
          },
        }),
        JSON.stringify({
          type: "assistant",
          message: {
            usage: {
              input_tokens: 2000,
              output_tokens: 1000,
              cache_creation_input_tokens: 200,
              cache_read_input_tokens: 1000,
            },
          },
        }),
      ];
      writeFileSync(filePath, `${lines.join("\n")}\n`);

      const result = await resolver.getCumulativeCache(filePath);
      // With cumulative format detection (values increasing), should use last values
      assert.strictEqual(result?.cacheRead, 1000);
      assert.strictEqual(result?.cacheCreation, 200);

      unlinkSync(filePath);
    });
  });

  describe("reset", () => {
    it("should reset internal state", async () => {
      const data: StdinData = {
        hook_event_name: "prompt_submit" as const,
        model: { id: "test", display_name: "Test" },
        cwd: "/test",
        session_id: "session-1",
        context_window: {
          current_usage: {
            input_tokens: 1000,
            output_tokens: 500,
          },
        },
      };

      await resolver.resolve(data);
      resolver.reset();

      // After reset, same session should not be detected as changed
      const result = await resolver.resolve(data);
      assert.strictEqual(result.sessionChanged, false);
    });
  });
});
