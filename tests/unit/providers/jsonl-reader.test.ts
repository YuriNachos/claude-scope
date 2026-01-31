import assert from "node:assert";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { processJsonlFile, readJsonlLines } from "../../../src/providers/jsonl-reader.js";

describe("jsonl-reader", () => {
  const testDir = join(tmpdir(), "jsonl-reader-test");

  // Create test directory
  try {
    mkdirSync(testDir, { recursive: true });
  } catch {}

  describe("readJsonlLines", () => {
    it("should return empty array for non-existent file", async () => {
      const result = await readJsonlLines("/nonexistent/path/file.jsonl");
      assert.deepStrictEqual(result, []);
    });

    it("should return empty array for empty file", async () => {
      const filePath = join(testDir, "empty.jsonl");
      writeFileSync(filePath, "");

      const result = await readJsonlLines(filePath);
      assert.deepStrictEqual(result, []);

      unlinkSync(filePath);
    });

    it("should read and trim lines", async () => {
      const filePath = join(testDir, "lines.jsonl");
      writeFileSync(filePath, '{"a": 1}\n  {"b": 2}  \n{"c": 3}\n');

      const result = await readJsonlLines(filePath);
      assert.deepStrictEqual(result, ['{"a": 1}', '{"b": 2}', '{"c": 3}']);

      unlinkSync(filePath);
    });

    it("should skip empty lines", async () => {
      const filePath = join(testDir, "with-empty.jsonl");
      writeFileSync(filePath, '{"a": 1}\n\n{"b": 2}\n   \n{"c": 3}\n');

      const result = await readJsonlLines(filePath);
      assert.deepStrictEqual(result, ['{"a": 1}', '{"b": 2}', '{"c": 3}']);

      unlinkSync(filePath);
    });
  });

  describe("processJsonlFile", () => {
    it("should return empty array for non-existent file", async () => {
      const result = await processJsonlFile("/nonexistent/path/file.jsonl", () => null);
      assert.deepStrictEqual(result, []);
    });

    it("should parse and process valid JSON lines", async () => {
      const filePath = join(testDir, "valid.jsonl");
      writeFileSync(filePath, '{"type": "a", "value": 1}\n{"type": "b", "value": 2}\n');

      const result = await processJsonlFile<{ type: string; value: number }>(
        filePath,
        (parsed) => parsed as { type: string; value: number }
      );

      assert.deepStrictEqual(result, [
        { type: "a", value: 1 },
        { type: "b", value: 2 },
      ]);

      unlinkSync(filePath);
    });

    it("should skip lines where processor returns null", async () => {
      const filePath = join(testDir, "filter.jsonl");
      writeFileSync(filePath, '{"type": "a"}\n{"type": "b"}\n{"type": "a"}\n');

      const result = await processJsonlFile<string>(filePath, (parsed) => {
        const obj = parsed as { type: string };
        return obj.type === "a" ? obj.type : null;
      });

      assert.deepStrictEqual(result, ["a", "a"]);

      unlinkSync(filePath);
    });

    it("should skip malformed JSON lines", async () => {
      const filePath = join(testDir, "malformed.jsonl");
      writeFileSync(filePath, '{"valid": true}\nnot json\n{"also": "valid"}\n');

      const result = await processJsonlFile<boolean | string>(filePath, (parsed) => {
        const obj = parsed as Record<string, unknown>;
        return obj.valid ?? obj.also ?? null;
      });

      assert.deepStrictEqual(result, [true, "valid"]);

      unlinkSync(filePath);
    });
  });
});
