/**
 * Config diagnostics output
 *
 * A statusline host discards stderr, so a warning printed there is
 * indistinguishable from silence - which is how a broken config used to go
 * unnoticed. Problems are surfaced two ways instead:
 *
 * - a report file next to the config, which is the durable record; its very
 *   existence means something is wrong, so it is deleted once nothing is.
 * - one short line appended to the statusline while problems last.
 */

import { existsSync } from "node:fs";
import { unlink, writeFile } from "node:fs/promises";
import { formatError } from "../validation/result.js";
import type { ConfigProblem } from "./config-validator.js";
import { getConfigPath, getConfigReportPath } from "./paths.js";

// Re-exported so callers of the report API do not need a second import; the
// path itself is defined once, in paths.ts.
export { getConfigReportPath };

/**
 * Write - or clear - the diagnostics report
 *
 * Never throws: an unwritable config directory simply leaves no report.
 *
 * @param problems - Problems found while loading the config
 * @param quarantinedTo - Where the previous config was saved, if it was replaced
 */
export async function writeConfigReport(
  problems: ConfigProblem[],
  quarantinedTo?: string | null
): Promise<void> {
  const reportPath = getConfigReportPath();

  if (problems.length === 0) {
    // The file's existence is the signal, so a clean load must remove it. The
    // stat keeps the common case - clean config, no report - syscall-free.
    if (existsSync(reportPath)) {
      await unlink(reportPath).catch(() => {});
    }
    return;
  }

  const lines = [
    "claude-scope config report",
    `Config: ${getConfigPath()}`,
    "",
    ...problems.map((problem) => `- ${formatError(problem)}`),
  ];

  if (quarantinedTo) {
    lines.push(
      "",
      "Your previous config could not be used and was saved to:",
      `  ${quarantinedTo}`
    );
  }

  lines.push("", "Fix the entries above, or run: claude-scope quick-config");

  await writeFile(reportPath, `${lines.join("\n")}\n`, "utf-8").catch(() => {});
}

/**
 * One-line statusline notice about config problems
 *
 * @param problems - Problems found while loading the config
 * @param quarantinedTo - Where the previous config was saved, if it was replaced
 * @returns The line to append, or `null` when the config is clean
 */
export function formatConfigNagLine(
  problems: ConfigProblem[],
  quarantinedTo?: string | null
): string | null {
  if (problems.length === 0) {
    return null;
  }

  if (quarantinedTo) {
    return `⚠ config was invalid - reset to default, backup at ${quarantinedTo}`;
  }

  const count = problems.length === 1 ? "1 problem" : `${problems.length} problems`;
  return `⚠ config: ${count} (see ${getConfigReportPath()})`;
}
