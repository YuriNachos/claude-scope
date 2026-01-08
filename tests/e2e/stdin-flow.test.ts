/**
 * End-to-end test for stdin → stdout flow
 * Tests the complete CLI flow: stdin input → JSON parsing → widget rendering → output
 */

import { exec } from "node:child_process";
import { describe, it } from "node:test";
import { promisify } from "node:util";
import { expect } from "chai";
import { stripAnsi } from "../helpers/snapshot.js";

const execAsync = promisify(exec);

describe("E2E: CLI stdin → stdout flow", () => {
  it("should process valid stdin JSON and output status line", async () => {
    const input = JSON.stringify({
      hook_event_name: "Status",
      session_id: "test-e2e-session",
      transcript_path: "/tmp/test.json",
      cwd: process.cwd(),
      model: { id: "test-model", display_name: "Test Model" },
      workspace: {
        current_dir: process.cwd(),
        project_dir: process.cwd(),
      },
      version: "1.0.0",
      output_style: { name: "default" },
      cost: {
        total_cost_usd: 0.05,
        total_duration_ms: 120000,
        total_api_duration_ms: 8000,
        total_lines_added: 100,
        total_lines_removed: 50,
      },
      context_window: {
        total_input_tokens: 5000,
        total_output_tokens: 2000,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 30000,
          output_tokens: 8000,
          cache_creation_input_tokens: 2000,
          cache_read_input_tokens: 0,
        },
      },
    });

    const { stdout, stderr } = await execAsync(`echo '${input}' | node dist/index.js`, {
      cwd: process.cwd(),
    });

    // Should output status line
    const cleanOutput = stripAnsi(stdout);
    expect(cleanOutput).to.be.a("string");
    expect(cleanOutput).to.include("Test Model");
    expect(cleanOutput).to.include("%");
    expect(cleanOutput).to.include("$0.05");
    expect(cleanOutput).to.include("2m 0s");
  });

  it("should return git fallback for invalid JSON", async () => {
    const { stdout } = await execAsync(`echo 'invalid json' | node dist/index.js`, {
      cwd: process.cwd(),
    });

    // Should return git branch as fallback (or empty if not in git repo)
    // We're in a git repo, so expect branch name
    expect(stdout).to.not.equal("");
    // Should contain branch name (main, master, HEAD, or feature branch)
    expect(stdout).to.match(/main|master|origin|HEAD/);
  });

  it("should return git fallback for empty stdin", async () => {
    const { stdout } = await execAsync(`echo '' | node dist/index.js`, {
      cwd: process.cwd(),
    });

    // Should return git branch as fallback
    expect(stdout).to.not.equal("");
    expect(stdout).to.match(/main|master|origin|HEAD/);
  });

  it("should correctly calculate context percentage with cache_read tokens", async () => {
    // This test verifies context calculation includes cache_read tokens
    const input = JSON.stringify({
      hook_event_name: "Status",
      session_id: "test-context-calc",
      transcript_path: "/tmp/test.json",
      cwd: process.cwd(),
      model: { id: "test-model", display_name: "Model" },
      workspace: {
        current_dir: process.cwd(),
        project_dir: process.cwd(),
      },
      version: "1.0.0",
      output_style: { name: "default" },
      cost: {
        total_cost_usd: 0,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0,
      },
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 100000,
        current_usage: {
          input_tokens: 40000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 15000, // Should be counted (occupies context space)
        },
      },
    });

    const { stdout } = await execAsync(`echo '${input}' | node dist/index.js`, {
      cwd: process.cwd(),
    });

    // Calculation: (40000 + 10000 + 5000 + 15000) / 100000 = 70%
    // cache_read_input_tokens (15000) IS counted - they occupy context space
    expect(stripAnsi(stdout)).to.include("70%");
  });
});
