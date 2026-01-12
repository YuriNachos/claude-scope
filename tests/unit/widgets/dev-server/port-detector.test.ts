/**
 * Unit tests for PortDetector
 *
 * These tests use dependency injection to mock execFile calls,
 * allowing true unit testing without relying on system state.
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import type { ExecFileFn } from "../../../../src/widgets/dev-server/detector-types.js";
import { PortDetector } from "../../../../src/widgets/dev-server/port-detector.js";

describe("PortDetector", () => {
  describe("detect() - Unit Tests with Mocked execFile", () => {
    it("should return null when lsof command fails", async () => {
      // Mock execFile that throws error (lsof not available)
      const mockExecFile: ExecFileFn = async () => {
        throw new Error("lsof: command not found");
      };

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.strictEqual(result, null, "Should return null when lsof fails");
    });

    it("should return null when lsof returns empty output", async () => {
      // Mock execFile that returns empty output (no ports listening)
      const mockExecFile: ExecFileFn = async () => ({
        stdout: "",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.strictEqual(result, null, "Should return null when no servers detected");
    });

    it("should return null when lsof output has no matching ports", async () => {
      // Mock execFile that returns output for unmapped port
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    12345 user   24u  IPv4  0x0      0t0  TCP *:9999 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.strictEqual(result, null, "Should return null for unmapped ports");
    });

    it("should detect Vite server on port 5173", async () => {
      // Mock execFile that returns Vite server output
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    12345 user   24u  IPv4  0x0      0t0  TCP *:5173 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect Vite server");
      assert.strictEqual(result?.name, "Vite");
      assert.strictEqual(result?.icon, "⚡");
      assert.strictEqual(result?.port, 5173);
      assert.strictEqual(result?.isRunning, true);
      assert.strictEqual(result?.isBuilding, false);
    });

    it("should detect Angular server on port 4200", async () => {
      // Mock execFile that returns Angular server output
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    67890 user   24u  IPv4  0x0      0t0  TCP *:4200 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect Angular server");
      assert.strictEqual(result?.name, "Angular");
      assert.strictEqual(result?.icon, "▲");
      assert.strictEqual(result?.port, 4200);
      assert.strictEqual(result?.isRunning, true);
      assert.strictEqual(result?.isBuilding, false);
    });

    it("should detect Dev server on port 3000", async () => {
      // Mock execFile that returns Dev server output
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    11111 user   24u  IPv4  0x0      0t0  TCP *:3000 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect Dev server");
      assert.strictEqual(result?.name, "Dev");
      assert.strictEqual(result?.icon, "🚀");
      assert.strictEqual(result?.port, 3000);
      assert.strictEqual(result?.isRunning, true);
      assert.strictEqual(result?.isBuilding, false);
    });

    it("should detect Webpack server on port 8080", async () => {
      // Mock execFile that returns Webpack server output
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    22222 user   24u  IPv4  0x0      0t0  TCP *:8080 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect Webpack server");
      assert.strictEqual(result?.name, "Webpack");
      assert.strictEqual(result?.icon, "📦");
      assert.strictEqual(result?.port, 8080);
      assert.strictEqual(result?.isRunning, true);
      assert.strictEqual(result?.isBuilding, false);
    });

    it("should detect Dev server on port 8000", async () => {
      // Mock execFile that returns Dev server output on port 8000
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\npython  33333 user   24u  IPv4  0x0      0t0  TCP *:8000 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect Dev server on 8000");
      assert.strictEqual(result?.name, "Dev");
      assert.strictEqual(result?.icon, "🚀");
      assert.strictEqual(result?.port, 8000);
    });

    it("should detect Dev server on port 8888", async () => {
      // Mock execFile that returns Dev server output on port 8888
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\njupyter 44444 user   24u  IPv4  0x0      0t0  TCP *:8888 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect Dev server on 8888");
      assert.strictEqual(result?.name, "Dev");
      assert.strictEqual(result?.icon, "🚀");
      assert.strictEqual(result?.port, 8888);
    });

    it("should return first detected server when multiple servers are running", async () => {
      // Mock execFile that returns multiple servers (should return first match)
      const mockExecFile: ExecFileFn = async () => ({
        stdout:
          "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    12345 user   24u  IPv4  0x0      0t0  TCP *:5173 (LISTEN)\nnode    67890 user   24u  IPv4  0x0      0t0  TCP *:3000 (LISTEN)",
      });

      const detector = new PortDetector(mockExecFile);
      const result = await detector.detect();

      assert.notStrictEqual(result, null, "Should detect a server");
      // Should return the first one found (5173 - Vite)
      assert.strictEqual(result?.name, "Vite");
      assert.strictEqual(result?.port, 5173);
    });

    it("should build correct lsof arguments", async () => {
      // Mock execFile that captures the arguments passed to it
      let capturedArgs: string[] | null = null;
      const mockExecFile: ExecFileFn = async (_command, args) => {
        capturedArgs = args;
        return { stdout: "" };
      };

      const detector = new PortDetector(mockExecFile);
      await detector.detect();

      assert.notStrictEqual(capturedArgs, null, "Should capture arguments");

      // Check base arguments
      assert.ok(capturedArgs?.includes("-nP"), "Should include -nP flag");
      assert.ok(capturedArgs?.includes("-iTCP"), "Should include -iTCP flag");
      assert.ok(capturedArgs?.includes("-sTCP:LISTEN"), "Should include -sTCP:LISTEN flag");

      // Check port arguments (added as separate -i and :port arguments)
      assert.ok(capturedArgs?.includes("-i"), "Should include -i flag");
      assert.ok(capturedArgs?.includes(":5173"), "Should include port 5173");
      assert.ok(capturedArgs?.includes(":4200"), "Should include port 4200");
      assert.ok(capturedArgs?.includes(":3000"), "Should include port 3000");
      assert.ok(capturedArgs?.includes(":8080"), "Should include port 8080");
      assert.ok(capturedArgs?.includes(":8000"), "Should include port 8000");
      assert.ok(capturedArgs?.includes(":8888"), "Should include port 8888");
    });

    it("should pass timeout option to execFile", async () => {
      // Mock execFile that captures the options passed to it
      let capturedOptions: { timeout?: number } | null = null;
      const mockExecFile: ExecFileFn = async (_command, _args, options) => {
        capturedOptions = options ?? {};
        return { stdout: "" };
      };

      const detector = new PortDetector(mockExecFile);
      await detector.detect();

      assert.notStrictEqual(capturedOptions, null, "Should capture options");
      assert.strictEqual(capturedOptions?.timeout, 2000, "Should set 2000ms timeout");
    });
  });
});
