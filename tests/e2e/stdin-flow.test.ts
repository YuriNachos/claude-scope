/**
 * End-to-end test for stdin → stdout flow
 * Tests the complete CLI flow: stdin input → JSON parsing → widget rendering → output
 */

import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { expect } from "chai";
import { generateBalancedLayout } from "../../src/config/default-config.js";
import { stripAnsi } from "../helpers/snapshot.js";

/**
 * Spawn the built CLI with the given stdin payload and environment, and
 * collect its stdout/stderr.
 *
 * Writes `input` directly to the child's stdin instead of shelling out
 * through `echo '<json>' | node dist/index.js`: on Windows, `exec()` runs the
 * command through `cmd.exe`, which mangles a JSON string containing quotes
 * and `$` on the command line - the child then receives corrupted stdin,
 * throws inside `main()`'s parse step, and silently falls back to the
 * git-only status line regardless of what the config contains. Piping via
 * `child.stdin` sidesteps shell quoting entirely.
 */
function runCli(
  input: string,
  env: NodeJS.ProcessEnv
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["dist/index.js"], { cwd: process.cwd(), env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", () => resolve({ stdout, stderr }));
    child.stdin.write(input);
    child.stdin.end();
  });
}

describe("E2E: CLI stdin → stdout flow", () => {
  // The spawned CLI resolves its config through `getConfigDir()`
  // (src/config/paths.ts), which reads the REAL `~/.claude-scope/config.json`
  // (or generates a default there) unless `CLAUDE_SCOPE_HOME` is set. Without
  // an override, the rendered widget set - and therefore these assertions -
  // would depend on whatever happens to exist on the machine running the
  // suite. Every spawn below points CLAUDE_SCOPE_HOME at a temp dir seeded
  // with a KNOWN config (model + context + cost + duration on line 0) so the
  // assertions are deterministic and the suite never touches the developer's
  // real ~/.claude-scope.
  let scopeHomeDir: string;
  let childEnv: NodeJS.ProcessEnv;

  before(async () => {
    scopeHomeDir = await mkdtemp(join(tmpdir(), "claude-scope-e2e-"));
    const knownConfig = generateBalancedLayout("balanced", "monokai");
    await writeFile(
      join(scopeHomeDir, "config.json"),
      JSON.stringify(knownConfig, null, 2),
      "utf-8"
    );
    childEnv = { ...process.env, CLAUDE_SCOPE_HOME: scopeHomeDir };
  });

  after(async () => {
    await rm(scopeHomeDir, { recursive: true, force: true });
  });

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

    const { stdout } = await runCli(input, childEnv);

    // Should output status line
    const cleanOutput = stripAnsi(stdout);
    expect(cleanOutput).to.be.a("string");
    expect(cleanOutput).to.include("Test Model");
    expect(cleanOutput).to.include("%");
    expect(cleanOutput).to.include("$0.05");
    expect(cleanOutput).to.include("2m 0s");
  });

  it("should return git fallback for invalid JSON", async () => {
    const { stdout } = await runCli("invalid json", childEnv);

    // Should return git branch as fallback (or empty if not in git repo)
    // We're in a git repo, so expect non-empty output with branch name
    expect(stdout).to.not.equal("");
    // Should contain some text (branch name, color codes, etc.)
    expect(stdout.trim().length).to.be.greaterThan(0);
  });

  it("should return git fallback for empty stdin", async () => {
    const { stdout } = await runCli("", childEnv);

    // Should return git branch as fallback
    expect(stdout).to.not.equal("");
    // Should contain some text (branch name, color codes, etc.)
    expect(stdout.trim().length).to.be.greaterThan(0);
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

    const { stdout } = await runCli(input, childEnv);

    // ccstatusline formula: input + cache_read + cache_creation (no output_tokens)
    // Calculation: (40000 + 15000 + 5000) / 100000 = 60%
    expect(stripAnsi(stdout)).to.include("60%");
  });
});
