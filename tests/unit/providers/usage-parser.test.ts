/**
 * Unit tests for UsageParser
 */

import { join } from "node:path";
import { describe, it } from "node:test";
import { expect } from "chai";
import { UsageParser } from "../../../src/providers/usage-parser.js";

describe("UsageParser", () => {
  const fixturesPath = join(process.cwd(), "tests", "fixtures", "transcript-samples");
  const parser = new UsageParser();

  describe("parseLastUsage", () => {
    it("should return null if transcript file does not exist", async () => {
      const result = await parser.parseLastUsage(join(fixturesPath, "nonexistent.jsonl"));
      expect(result).to.be.null;
    });

    it("should return null if transcript is empty", async () => {
      const result = await parser.parseLastUsage(join(fixturesPath, "empty.jsonl"));
      expect(result).to.be.null;
    });

    it("should extract usage from last assistant message", async () => {
      const result = await parser.parseLastUsage(join(fixturesPath, "with-usage.jsonl"));
      expect(result).to.not.be.null;
      // Last assistant message has input_tokens: 150
      expect(result?.input_tokens).to.equal(150);
      expect(result?.output_tokens).to.equal(75);
      expect(result?.cache_read_input_tokens).to.equal(25000);
      expect(result?.cache_creation_input_tokens).to.equal(3000);
    });

    it("should handle missing cache_creation_input_tokens (default to 0)", async () => {
      const result = await parser.parseLastUsage(
        join(fixturesPath, "missing-cache-creation.jsonl")
      );
      expect(result).to.not.be.null;
      expect(result?.cache_creation_input_tokens).to.equal(0);
      expect(result?.cache_read_input_tokens).to.equal(20000);
    });

    it("should skip user messages and find assistant message", async () => {
      const result = await parser.parseLastUsage(join(fixturesPath, "with-usage.jsonl"));
      expect(result).to.not.be.null;
      // Should find assistant message, not user message
      expect(result?.input_tokens).to.be.greaterThan(0);
    });

    it("should return null when no assistant messages have usage", async () => {
      const result = await parser.parseLastUsage(join(fixturesPath, "no-usage.jsonl"));
      expect(result).to.be.null;
    });

    it("should handle malformed JSON lines gracefully", async () => {
      // Create a file with malformed JSON
      const { writeFileSync, unlinkSync } = await import("node:fs");
      const malformedPath = join(fixturesPath, "malformed.jsonl");
      writeFileSync(
        malformedPath,
        '{"valid": true}\n{invalid json}\n{"type":"assistant","message":{"usage":{"input_tokens":100,"output_tokens":50,"cache_read_input_tokens":20000}}}\n'
      );

      const result = await parser.parseLastUsage(malformedPath);
      // Should skip malformed line and find the valid one
      expect(result).to.not.be.null;
      expect(result?.input_tokens).to.equal(100);

      // Cleanup
      unlinkSync(malformedPath);
    });

    it("should return the LAST assistant message with usage", async () => {
      const result = await parser.parseLastUsage(join(fixturesPath, "with-usage.jsonl"));
      expect(result).to.not.be.null;
      // with-usage.jsonl has 2 assistant messages
      // Last one has input_tokens: 150, first has 100
      expect(result?.input_tokens).to.equal(150);
    });
  });
});
