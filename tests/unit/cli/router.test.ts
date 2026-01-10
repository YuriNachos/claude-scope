import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { parseCommand, routeCommand } from "../../../src/cli/index.js";

describe("CLI Router", () => {
  let originalArgv: string[];

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

  it("should route to quick-config handler", async () => {
    process.argv = ["node", "cli", "quick-config"];
    const command = parseCommand();
    assert.strictEqual(command, "quick-config");

    // routeCommand should complete without throwing
    await routeCommand(command);

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
