/**
 * Shared helper for running external commands
 *
 * Every external command runs on the statusline hot path: Claude Code waits for
 * the process to finish before drawing, so a command that never returns freezes
 * the whole statusline. All external commands therefore go through
 * `runCommand()`, which always applies a timeout and never throws - a failed or
 * timed-out command is reported as `null`, which callers treat as "no data".
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Options accepted by an exec function
 */
export interface ExecFileOptions {
  /** Milliseconds before the child process is killed */
  timeout?: number;
  /** Working directory for the command */
  cwd?: string;
}

/**
 * Result of an exec command
 */
export interface ExecFileResult {
  stdout: string;
  stderr?: string;
}

/**
 * Function signature for execFile (for dependency injection in tests)
 */
export type ExecFileFn = (
  command: string,
  args: string[],
  options?: ExecFileOptions
) => Promise<ExecFileResult>;

/**
 * Default exec implementation backed by `node:child_process`
 */
export const defaultExecFile: ExecFileFn = execFileAsync;

/**
 * Run an external command with a mandatory timeout
 *
 * @param command - Executable name, resolved via PATH
 * @param args - Arguments passed without shell interpolation
 * @param options - Timeout (required) and optional working directory
 * @param execFn - Exec implementation, injectable for tests
 * @returns Trimmed stdout, or `null` if the command failed, timed out or is missing
 */
export async function runCommand(
  command: string,
  args: string[],
  options: { timeout: number; cwd?: string },
  execFn: ExecFileFn = defaultExecFile
): Promise<string | null> {
  try {
    const { stdout } = await execFn(command, args, options);
    return stdout.trim();
  } catch {
    // Command missing, non-zero exit, or killed by the timeout
    return null;
  }
}
