/**
 * Unit tests for runCommand
 *
 * runCommand is the single choke point every external command (git, docker,
 * lsof, ps) goes through on the statusline hot path. These tests use
 * dependency injection (a fake execFn) so no real process is ever spawned.
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { expect } from "chai";
import type { ExecFileFn } from "../../../src/utils/exec.js";
import { runCommand } from "../../../src/utils/exec.js";

describe("runCommand", () => {
  it("should return trimmed stdout on success", async () => {
    const mockExecFile: ExecFileFn = async () => ({ stdout: "  hello world  \n" });

    const result = await runCommand("echo", ["hi"], { timeout: 1000 }, mockExecFile);

    expect(result).to.equal("hello world");
  });

  it("should pass command, args and options through to execFn unchanged", async () => {
    let captured: {
      command: string;
      args: string[];
      options?: { timeout: number; cwd?: string };
    } | null = null;
    const mockExecFile: ExecFileFn = async (command, args, options) => {
      captured = { command, args, options };
      return { stdout: "" };
    };

    await runCommand("git", ["status"], { timeout: 1500, cwd: "/repo" }, mockExecFile);

    expect(captured).to.not.be.null;
    expect(captured?.command).to.equal("git");
    expect(captured?.args).to.deep.equal(["status"]);
    expect(captured?.options).to.deep.equal({ timeout: 1500, cwd: "/repo" });
  });

  it("should return null when execFn throws (missing binary, non-zero exit, or a timeout kill)", async () => {
    const mockExecFile: ExecFileFn = async () => {
      throw new Error("Command failed: spawn ENOENT");
    };

    const result = await runCommand("nonexistent-binary", [], { timeout: 1000 }, mockExecFile);

    expect(result).to.be.null;
  });

  it("should never reject even when execFn rejects (timeout kill included)", async () => {
    const mockExecFile: ExecFileFn = async () => {
      throw new Error("killed by SIGTERM after timeout");
    };

    await assert.doesNotReject(() =>
      runCommand("git", ["status"], { timeout: 1000 }, mockExecFile)
    );
  });

  it("should treat an empty stdout as a valid (empty) result, not a failure", async () => {
    const mockExecFile: ExecFileFn = async () => ({ stdout: "" });

    const result = await runCommand("git", ["tag"], { timeout: 1000 }, mockExecFile);

    expect(result).to.equal("");
    expect(result).to.not.be.null;
  });
});
