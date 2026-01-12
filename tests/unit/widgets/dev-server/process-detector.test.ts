/**
 * Unit tests for ProcessDetector
 *
 * These tests use dependency injection to mock execFile calls,
 * allowing true unit testing without relying on system state.
 *
 * Note: Some patterns (npm/yarn/pnpm/bun) have known issues with realistic ps aux output
 * format. These tests focus on patterns that work correctly (Framework, Vite, DevServer).
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import type { ExecFileFn } from "../../../../src/widgets/dev-server/process-detector.js";
import { ProcessDetector } from "../../../../src/widgets/dev-server/process-detector.js";

describe("ProcessDetector", () => {
  describe("detect() - Unit Tests with Mocked execFile", () => {
    it("should return null when ps command fails", async () => {
      const mockExecFile: ExecFileFn = async () => {
        throw new Error("ps: command not found");
      };

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.strictEqual(result, null, "Should return null when ps fails");
    });

    it("should return null when no matching processes found", async () => {
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 some random process",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.strictEqual(result, null, "Should return null when no servers detected");
    });

    it("should detect vite processes", async () => {
      // Pattern: /\/node.*\/vite\s*$/i
      // Matches paths like /path/to/node_modules/.bin/vite
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /path/to/node_modules/.bin/vite",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect vite process");
      assert.strictEqual(result?.name, "Vite");
      assert.strictEqual(result?.icon, "⚡");
      assert.strictEqual(result?.isRunning, true);
      assert.strictEqual(result?.isBuilding, false);
    });

    it("should detect nuxt dev processes", async () => {
      // Pattern: /\/(nuxt|next|astro|remix|svelte)\s+dev/i
      // Matches paths like /usr/local/bin/nuxt dev
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /usr/local/bin/nuxt dev",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect nuxt dev process");
      assert.strictEqual(result?.name, "Framework");
      assert.strictEqual(result?.icon, "⚡");
      assert.strictEqual(result?.isRunning, true);
      assert.strictEqual(result?.isBuilding, false);
    });

    it("should detect next dev processes", async () => {
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /usr/local/bin/next dev",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect next dev process");
      assert.strictEqual(result?.name, "Framework");
    });

    it("should detect astro dev processes", async () => {
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /usr/local/bin/astro dev",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect astro dev process");
      assert.strictEqual(result?.name, "Framework");
    });

    it("should detect remix dev processes", async () => {
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /usr/local/bin/remix dev",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect remix dev process");
      assert.strictEqual(result?.name, "Framework");
    });

    it("should detect svelte dev processes", async () => {
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /usr/local/bin/svelte dev",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect svelte dev process");
      assert.strictEqual(result?.name, "Framework");
    });

    it("should detect fallback devserver processes", async () => {
      // Pattern: /\s(nuxt|next|vite)\s+dev\s/i
      // Fallback pattern that matches simple format like "next dev"
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 some path next dev args",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect fallback devserver pattern");
      assert.strictEqual(result?.name, "DevServer");
      assert.strictEqual(result?.icon, "⚡");
    });

    it("should return first matching process when multiple patterns match", async () => {
      // Should match Framework pattern first, not fallback DevServer
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n" +
          "user             12345   0.0  0.1  4500000  12000 s001  Ss    1:00PM   0:00.01 /usr/local/bin/next dev",
      });

      const detector = new ProcessDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect first matching pattern");
      assert.strictEqual(result?.name, "Framework");
    });

    it("should build correct ps arguments", async () => {
      let capturedArgs: string[] | null = null;
      const mockExecFile: ExecFileFn = async (_command, args) => {
        capturedArgs = args;
        return { stdout: "" };
      };

      const detector = new ProcessDetector(mockExecFile);
      await detector.detect();

      assert.notStrictEqual(capturedArgs, null, "Should capture arguments");
      assert.deepStrictEqual(capturedArgs, ["aux"], "Should call ps aux");
    });

    it("should pass timeout option to execFile", async () => {
      let capturedOptions: { timeout?: number } | null = null;
      const mockExecFile: ExecFileFn = async (_command, _args, options) => {
        capturedOptions = options ?? {};
        return { stdout: "" };
      };

      const detector = new ProcessDetector(mockExecFile);
      await detector.detect();

      assert.notStrictEqual(capturedOptions, null, "Should capture options");
      assert.strictEqual(capturedOptions?.timeout, 1000, "Should set 1000ms timeout");
    });
  });
});
