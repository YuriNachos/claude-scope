/**
 * Unit tests for DockerWidget's exec wiring and unavailable-status caching
 *
 * Uses dependency injection to mock execFile calls, so no real docker
 * process is ever spawned. Complements tests/unit/widgets/docker/docker-widget.test.ts
 * (metadata/config tests, not exec-glob-picked-up).
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { DEFAULT_THEME } from "../../../src/ui/theme/index.js";
import type { ExecFileFn } from "../../../src/utils/exec.js";
import { DockerWidget } from "../../../src/widgets/docker/docker-widget.js";

interface RecordedCall {
  command: string;
  args: string[];
}

/**
 * Builds a fake execFn that records every call it receives.
 * @param stdout - stdout to resolve with, or `null` to make the call throw (docker unreachable)
 */
function createMockExec(stdout: string | null): { fn: ExecFileFn; calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  const fn: ExecFileFn = async (command, args) => {
    calls.push({ command, args });
    if (stdout === null) {
      throw new Error("docker: command not found");
    }
    return { stdout };
  };
  return { fn, calls };
}

describe("DockerWidget exec wiring", () => {
  it("should make exactly one docker call, with args ['ps','-a','--format','{{.State}}']", async () => {
    const { fn, calls } = createMockExec("running\nrunning\nexited\n");
    const widget = new DockerWidget(DEFAULT_THEME, fn);

    await widget.render({ width: 80, timestamp: Date.now() });

    expect(calls.length).to.equal(1, "expected a single docker process spawn per render");
    expect(calls[0]?.command).to.equal("docker");
    expect(calls[0]?.args).to.deep.equal(["ps", "-a", "--format", "{{.State}}"]);
  });

  it("should count running vs total containers from the single-call output", async () => {
    const { fn } = createMockExec("running\nrunning\nexited\n");
    const widget = new DockerWidget(DEFAULT_THEME, fn);

    const result = await widget.render({ width: 80, timestamp: Date.now() });

    // balanced style: "Docker: 2/3 <status>" - 2 running out of 3 total
    expect(result).to.include("2/3");
  });

  it("should return null when the docker call fails", async () => {
    const { fn, calls } = createMockExec(null);
    const widget = new DockerWidget(DEFAULT_THEME, fn);

    const result = await widget.render({ width: 80, timestamp: Date.now() });

    expect(result).to.be.null;
    expect(calls.length).to.equal(1);
  });
});

describe("DockerWidget unavailable-status cache", () => {
  it("should not re-invoke docker for 60000ms after an unavailable result", async (t) => {
    t.mock.timers.enable({ apis: ["Date"] });
    const { fn, calls } = createMockExec(null);
    const widget = new DockerWidget(DEFAULT_THEME, fn);

    await widget.render({ width: 80, timestamp: Date.now() });
    expect(calls.length).to.equal(1);

    // Just before the 60s TTL expires - still cached, no second spawn
    t.mock.timers.tick(59999);
    await widget.render({ width: 80, timestamp: Date.now() });
    expect(calls.length).to.equal(1, "cache should still be valid at 59999ms");

    // Past the 60s TTL - cache expired, docker is queried again
    t.mock.timers.tick(2);
    await widget.render({ width: 80, timestamp: Date.now() });
    expect(calls.length).to.equal(2, "cache should have expired past 60000ms");
  });

  it("should render null (never through styleFn) while an unavailable status is cached", async (t) => {
    t.mock.timers.enable({ apis: ["Date"] });
    const { fn } = createMockExec(null);
    const widget = new DockerWidget(DEFAULT_THEME, fn);

    const first = await widget.render({ width: 80, timestamp: Date.now() });
    expect(first).to.be.null;

    t.mock.timers.tick(59999);
    const cached = await widget.render({ width: 80, timestamp: Date.now() });
    expect(cached).to.be.null;
  });
});
