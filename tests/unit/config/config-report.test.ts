import assert from "node:assert";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  formatConfigNagLine,
  getConfigReportPath,
  writeConfigReport,
} from "../../../src/config/config-report.js";
import type { ConfigProblem } from "../../../src/config/config-validator.js";

describe("config-report", () => {
  const originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "claude-scope-report-"));
    process.env.CLAUDE_SCOPE_HOME = dir;
  });

  afterEach(async () => {
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
    await rm(dir, { recursive: true, force: true });
  });

  describe("writeConfigReport", () => {
    it("deletes an existing report file when there are no problems", async () => {
      const reportPath = getConfigReportPath();
      await writeFile(reportPath, "stale report from a previous broken config\n");
      assert.ok(existsSync(reportPath));

      await writeConfigReport([]);

      assert.ok(!existsSync(reportPath), "the report should be deleted once the config is clean");
    });

    it("writes a report containing every problem's path when there are problems", async () => {
      const problems: ConfigProblem[] = [
        { path: ["lines", "0", "1", "id"], message: "Unknown widget", value: "bogus" },
        { path: ["theme"], message: "Expected one of: monokai, dracula", value: "not-real" },
      ];

      await writeConfigReport(problems);

      const reportPath = getConfigReportPath();
      assert.ok(existsSync(reportPath));
      const content = await readFile(reportPath, "utf-8");
      assert.ok(content.includes("lines.0.1.id: Unknown widget"));
      assert.ok(content.includes("theme: Expected one of: monokai, dracula"));
    });
  });

  describe("formatConfigNagLine", () => {
    it("returns null when there are no problems", () => {
      assert.strictEqual(formatConfigNagLine([]), null);
    });

    it("returns the heal message with the backup path when the config was quarantined", () => {
      const problems: ConfigProblem[] = [{ path: [], message: "bad", value: undefined }];

      const line = formatConfigNagLine(problems, "/tmp/config.invalid-xyz.json");

      assert.match(line as string, /reset to default/);
      assert.ok(line?.includes("/tmp/config.invalid-xyz.json"));
    });

    it("returns a singular/plural count message when repaired without quarantine", () => {
      const one = formatConfigNagLine([{ path: [], message: "bad", value: undefined }]);
      assert.match(one as string, /\b1 problem\b/);
      assert.doesNotMatch(one as string, /1 problems/);

      const two = formatConfigNagLine([
        { path: [], message: "bad", value: undefined },
        { path: [], message: "bad2", value: undefined },
      ]);
      assert.match(two as string, /2 problems/);
    });
  });
});
