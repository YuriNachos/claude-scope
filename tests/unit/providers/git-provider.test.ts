/**
 * Unit tests for NativeGit
 *
 * Uses dependency injection to mock execFile calls, so no real git process
 * is ever spawned. Mirrors the style of tests/unit/providers/mock-git.test.ts
 * and tests/unit/widgets/dev-server/port-detector.test.ts.
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { NativeGit } from "../../../src/providers/git-provider.js";
import type { ExecFileFn } from "../../../src/utils/exec.js";

describe("NativeGit", () => {
  describe("exec options", () => {
    it("should bound every git command with a 2000ms timeout and the constructor cwd", async () => {
      const calls: Array<{ args: string[]; options?: { timeout?: number; cwd?: string } }> = [];
      const mockExecFile: ExecFileFn = async (_command, args, options) => {
        calls.push({ args, options });
        return { stdout: "" };
      };

      const git = new NativeGit("/repo", mockExecFile);

      await git.status();
      await git.diffSummary();
      await git.latestTag?.();

      // One command per call above: status, diff, describe
      expect(calls.length).to.equal(3);
      for (const call of calls) {
        expect(call.options?.timeout).to.equal(2000, `expected 2000ms timeout for ${call.args[0]}`);
        expect(call.options?.cwd).to.equal("/repo");
      }
    });

    it("should invoke execFn with the 'git' command", async () => {
      let capturedCommand: string | null = null;
      const mockExecFile: ExecFileFn = async (command) => {
        capturedCommand = command;
        return { stdout: "## main" };
      };

      const git = new NativeGit("/repo", mockExecFile);
      await git.status();

      expect(capturedCommand).to.equal("git");
    });
  });

  describe("status()", () => {
    it("should parse the current branch from status output", async () => {
      const mockExecFile: ExecFileFn = async () => ({ stdout: "## main" });

      const git = new NativeGit("/repo", mockExecFile);
      const status = await git.status();

      expect(status.current).to.equal("main");
    });

    it("should stop at the first whitespace-free token (tracking info stays attached)", async () => {
      const mockExecFile: ExecFileFn = async () => ({ stdout: "## feature-x...origin/feature-x" });

      const git = new NativeGit("/repo", mockExecFile);
      const status = await git.status();

      expect(status.current).to.equal("feature-x...origin/feature-x");
    });

    it("should return null current branch when git is unavailable", async () => {
      const mockExecFile: ExecFileFn = async () => {
        throw new Error("git: command not found");
      };

      const git = new NativeGit("/repo", mockExecFile);
      const status = await git.status();

      expect(status.current).to.be.null;
    });
  });

  describe("diffSummary()", () => {
    it("should parse file count, insertions and deletions from shortstat output", async () => {
      const mockExecFile: ExecFileFn = async () => ({
        stdout: " 5 files changed, 12 insertions(+), 3 deletions(-)",
      });

      const git = new NativeGit("/repo", mockExecFile);
      const diff = await git.diffSummary();

      expect(diff.fileCount).to.equal(5);
      expect(diff.files).to.have.lengthOf(1);
      expect(diff.files[0]?.insertions).to.equal(12);
      expect(diff.files[0]?.deletions).to.equal(3);
    });

    it("should return an empty summary when git is unavailable", async () => {
      const mockExecFile: ExecFileFn = async () => {
        throw new Error("git: command not found");
      };

      const git = new NativeGit("/repo", mockExecFile);
      const diff = await git.diffSummary();

      expect(diff.fileCount).to.equal(0);
      expect(diff.files).to.have.lengthOf(0);
    });
  });

  describe("latestTag()", () => {
    it("should return the trimmed tag on success", async () => {
      const mockExecFile: ExecFileFn = async () => ({ stdout: "v1.2.3\n" });

      const git = new NativeGit("/repo", mockExecFile);
      const tag = await git.latestTag?.();

      expect(tag).to.equal("v1.2.3");
    });

    it("should return null when there are no tags (empty output)", async () => {
      const mockExecFile: ExecFileFn = async () => ({ stdout: "" });

      const git = new NativeGit("/repo", mockExecFile);
      const tag = await git.latestTag?.();

      expect(tag).to.be.null;
    });
  });
});
