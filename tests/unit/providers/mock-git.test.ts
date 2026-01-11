/**
 * MockGit Unit Tests
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import { MockGit } from "../../../src/providers/mock-git.js";

describe("MockGit", () => {
  it("should return main branch in status", async () => {
    const git = new MockGit("/any/path");
    const status = await git.status();

    assert.strictEqual(status.current, "main");
  });

  it("should return demo diff summary with changes", async () => {
    const git = new MockGit("/any/path");
    const diff = await git.diffSummary();

    assert.strictEqual(diff.fileCount, 3);
    assert.strictEqual(diff.files.length, 3);

    // Check total insertions
    const totalInsertions = diff.files.reduce((sum, f) => sum + f.insertions, 0);
    assert.strictEqual(totalInsertions, 142);

    // Check total deletions
    const totalDeletions = diff.files.reduce((sum, f) => sum + f.deletions, 0);
    assert.strictEqual(totalDeletions, 27);
  });

  it("should return latest tag v0.8.3", async () => {
    const git = new MockGit("/any/path");
    const tag = await git.latestTag();

    assert.strictEqual(tag, "v0.8.3");
  });

  it("should preserve cwd from constructor", () => {
    const git = new MockGit("/test/path");
    assert.strictEqual((git as any).cwd, "/test/path");
  });
});
