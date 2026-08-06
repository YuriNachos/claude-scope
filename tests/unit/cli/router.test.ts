import assert from "node:assert";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { register } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import { AVAILABLE_THEMES } from "../../../src/ui/theme/index.js";

// `src/cli/commands/quick-config/menu.ts` builds its interactive stages on
// `@inquirer/core`'s `createPrompt`, which attaches a real readline
// interface to `process.stdin` and blocks until a keypress arrives - there is
// no injectable seam. Registering this loader BEFORE the dynamic import below
// swaps that module for a deterministic stub (always picks the first choice)
// so `routeCommand("quick-config")` can be driven end-to-end without ever
// touching real stdin. See tests/helpers/mock-inquirer-core-loader.mjs.
register("../../helpers/mock-inquirer-core-loader.mjs", import.meta.url);

describe("CLI Router", () => {
  let originalArgv: string[];
  let originalScopeHome: string | undefined;
  let testHomeDir: string;
  let parseCommand: typeof import("../../../src/cli/index.js").parseCommand;
  let routeCommand: typeof import("../../../src/cli/index.js").routeCommand;

  before(async () => {
    originalScopeHome = process.env.CLAUDE_SCOPE_HOME;
    testHomeDir = await mkdtemp(join(tmpdir(), "claude-scope-router-test-"));
    process.env.CLAUDE_SCOPE_HOME = testHomeDir;

    // Dynamic import so it resolves AFTER the loader above is registered -
    // a static top-level import would be hoisted and evaluated before this
    // module's own body runs, loading the real (blocking) @inquirer/core.
    const cli = await import("../../../src/cli/index.js");
    parseCommand = cli.parseCommand;
    routeCommand = cli.routeCommand;
  });

  after(async () => {
    await rm(testHomeDir, { recursive: true, force: true });
    if (originalScopeHome === undefined) {
      delete process.env.CLAUDE_SCOPE_HOME;
    } else {
      process.env.CLAUDE_SCOPE_HOME = originalScopeHome;
    }
  });

  beforeEach(() => {
    // Save original argv
    originalArgv = process.argv;
  });

  it("should return 'stdin' as default command", async () => {
    process.argv = ["node", "cli"];
    const command = parseCommand();
    assert.strictEqual(command, "stdin");
    process.argv = originalArgv;
  });

  it("should return 'quick-config' when argument provided", async () => {
    process.argv = ["node", "cli", "quick-config"];
    const command = parseCommand();
    assert.strictEqual(command, "quick-config");
    process.argv = originalArgv;
  });

  it("should route to quick-config handler and persist the selected config", async () => {
    process.argv = ["node", "cli", "quick-config"];
    const command = parseCommand();
    assert.strictEqual(command, "quick-config");

    // routeCommand should complete without throwing - and without hanging,
    // now that @inquirer/core is stubbed to auto-select the first choice at
    // every stage.
    await routeCommand(command);

    // Prove the quick-config branch actually ran end-to-end (not just that
    // the promise resolved): the stub always picks the first offered choice
    // at each of the 3 stages, so the saved config's theme must be the first
    // entry of the real AVAILABLE_THEMES list - an oracle independent of the
    // handler under test.
    const saved = JSON.parse(await readFile(join(testHomeDir, "config.json"), "utf-8"));
    assert.strictEqual(saved.theme, AVAILABLE_THEMES[0].name);
    assert.ok(Array.isArray(saved.lines["0"]), "saved config should have line 0 widgets");

    process.argv = originalArgv;
  });

  it("should throw error when trying to route stdin mode", async () => {
    await assert.rejects(
      async () => {
        await routeCommand("stdin");
      },
      { message: "stdin mode should be handled by main()" }
    );
  });
});
