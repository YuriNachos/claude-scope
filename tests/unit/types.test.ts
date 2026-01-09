import { describe, it } from "node:test";
import { expect } from "chai";
import type { GitInfo, ModelInfo, RenderContext, StdinData } from "../../src/types.js";

describe("StdinData", () => {
  it("should accept valid stdin data structure", () => {
    const mockData: StdinData = {
      session_id: "test-session-123",
      cwd: "/Users/test/project",
      model: {
        id: "claude-opus-4-5",
        display_name: "Opus 4.5",
      },
    };

    expect(mockData.session_id).to.equal("test-session-123");
    expect(mockData.cwd).to.equal("/Users/test/project");
    expect(mockData.model.id).to.equal("claude-opus-4-5");
  });

  it("should accept ModelInfo structure", () => {
    const model: ModelInfo = {
      id: "claude-opus-4-5",
      display_name: "Opus 4.5",
    };

    expect(model.id).to.equal("claude-opus-4-5");
    expect(model.display_name).to.equal("Opus 4.5");
  });

  it("should accept GitInfo structure", () => {
    const git: GitInfo = {
      branch: "main",
      isRepo: true,
    };

    expect(git.branch).to.equal("main");
    expect(git.isRepo).to.be.true;
  });

  it("should accept RenderContext structure", () => {
    const context: RenderContext = {
      width: 80,
      timestamp: Date.now(),
    };

    expect(context.width).to.equal(80);
    expect(context.timestamp).to.be.a("number");
  });
});
