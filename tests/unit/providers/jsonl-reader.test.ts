import assert from "node:assert";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  processJsonlFile,
  readJsonlLines,
  readJsonlTail,
  scanJsonlTail,
} from "../../../src/providers/jsonl-reader.js";

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

  describe("readJsonlTail", () => {
    it("should report a non-existent file as whole", async () => {
      const result = await readJsonlTail("/nonexistent/path/file.jsonl", 1024);
      assert.deepStrictEqual(result, { lines: [], isWholeFile: true });
    });

    it("should return every line when the window covers the file", async () => {
      const filePath = join(testDir, "tail-small.jsonl");
      writeFileSync(filePath, '{"a": 1}\n{"b": 2}\n{"c": 3}\n');

      const result = await readJsonlTail(filePath, 1024 * 1024);
      assert.deepStrictEqual(result.lines, ['{"a": 1}', '{"b": 2}', '{"c": 3}']);
      assert.strictEqual(result.isWholeFile, true);

      unlinkSync(filePath);
    });

    it("should drop the partial first line of a narrow window", async () => {
      const filePath = join(testDir, "tail-narrow.jsonl");
      writeFileSync(filePath, '{"a": 1}\n{"b": 2}\n{"c": 3}\n');

      // Reaches back into the {"b": 2} record, which must not be yielded whole
      const result = await readJsonlTail(filePath, 14);
      assert.deepStrictEqual(result.lines, ['{"c": 3}']);
      assert.strictEqual(result.isWholeFile, false);

      unlinkSync(filePath);
    });

    it("should not split a multi-byte character across the window edge", async () => {
      const filePath = join(testDir, "tail-utf8.jsonl");
      writeFileSync(filePath, '{"t": "한글 텍스트"}\n{"t": "ok"}\n');

      // Byte offset lands inside the multi-byte text of the first record
      const result = await readJsonlTail(filePath, 20);
      assert.deepStrictEqual(result.lines, ['{"t": "ok"}']);

      unlinkSync(filePath);
    });

    it("should yield nothing when one line fills the window", async () => {
      const filePath = join(testDir, "tail-huge-line.jsonl");
      writeFileSync(filePath, `{"a": 1}\n{"big": "${"x".repeat(4096)}"}\n`);

      const result = await readJsonlTail(filePath, 512);
      assert.deepStrictEqual(result.lines, []);
      assert.strictEqual(result.isWholeFile, false);

      unlinkSync(filePath);
    });
  });

  describe("scanJsonlTail", () => {
    it("should answer from the narrowest window that suffices", async () => {
      const filePath = join(testDir, "scan-narrow.jsonl");
      writeFileSync(filePath, '{"a": 1}\n{"b": 2}\n{"c": 3}\n');

      const seen: number[] = [];
      const answer = await scanJsonlTail(
        filePath,
        (lines) => {
          seen.push(lines.length);
          return lines.length >= 1 ? lines[lines.length - 1] : null;
        },
        [14, 1024]
      );

      assert.strictEqual(answer, '{"c": 3}');
      assert.deepStrictEqual(seen, [1], "should not have widened");

      unlinkSync(filePath);
    });

    it("should widen until the scan is satisfied", async () => {
      const filePath = join(testDir, "scan-widen.jsonl");
      writeFileSync(filePath, '{"a": 1}\n{"b": 2}\n{"c": 3}\n');

      const seen: number[] = [];
      const answer = await scanJsonlTail<string[]>(
        filePath,
        (lines) => {
          seen.push(lines.length);
          return lines.length >= 3 ? lines : null;
        },
        [14, 1024]
      );

      assert.deepStrictEqual(answer, ['{"a": 1}', '{"b": 2}', '{"c": 3}']);
      assert.deepStrictEqual(seen, [1, 3], "should have widened once");

      unlinkSync(filePath);
    });

    it("should make a final whole-file call the scan must answer", async () => {
      const filePath = join(testDir, "scan-final.jsonl");
      writeFileSync(filePath, '{"a": 1}\n{"b": 2}\n{"c": 3}\n');

      const flags: boolean[] = [];
      const answer = await scanJsonlTail(
        filePath,
        (lines, isWholeFile) => {
          flags.push(isWholeFile);
          // Never satisfied by a partial window
          return isWholeFile ? lines.length : null;
        },
        [14, 20]
      );

      assert.strictEqual(answer, 3);
      assert.deepStrictEqual(flags, [false, false, true]);

      unlinkSync(filePath);
    });

    it("should return null when even the whole file has no answer", async () => {
      const filePath = join(testDir, "scan-none.jsonl");
      writeFileSync(filePath, '{"a": 1}\n');

      const answer = await scanJsonlTail(filePath, () => null, [8]);
      assert.strictEqual(answer, null);

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
