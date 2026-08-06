/**
 * Default command runner for the dev-server detectors
 *
 * `lsof` and `ps aux` exist only on unix, so on Windows the detectors must not
 * pay for a spawn that is guaranteed to fail. That decision belongs to the
 * command runner rather than to `detect()`: an injected runner supplies its own
 * environment, and a platform check inside the method would override it - which
 * is exactly what made the detectors unverifiable on a Windows checkout.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { ExecFileFn } from "./detector-types.js";

const execFileAsync = promisify(execFile);

/**
 * Runner used where the unix tools do not exist
 *
 * Rejects for the same reason a missing binary would, so both detectors take
 * their existing "command unavailable" path.
 */
const unavailable: ExecFileFn = (command) =>
  Promise.reject(new Error(`${command} is not available on ${process.platform}`));

/**
 * The runner the detectors use when none is injected
 */
export const defaultDetectorExec: ExecFileFn =
  process.platform === "win32" ? unavailable : execFileAsync;
