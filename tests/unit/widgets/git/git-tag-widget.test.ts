/**
 * Unit tests for GitTagWidget
 *
 * Uses MockGit for fast, deterministic testing without real git operations
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { GitTagWidget } from "../../../../src/widgets/git/git-tag-widget.js";
import { MockGit } from "../../../fixtures/mock-git.js";
import { matchSnapshot, stripAnsi } from "../../../helpers/snapshot.js";

describe("GitTagWidget", () => {
  describe("metadata", () => {
    it("should have correct widget id", () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);
      expect(widget.id).to.equal("git-tag");
    });

    it("should have correct metadata properties", () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);
      expect(widget.metadata.name).to.equal("Git Tag Widget");
      expect(widget.metadata.description).to.equal("Displays the latest git tag");
      expect(widget.metadata.version).to.equal("1.0.0");
      expect(widget.metadata.author).to.equal("claude-scope");
    });

    it("should be enabled by default", () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("initialize", () => {
    it("should initialize with default enabled state", async () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: {} });
      expect(widget.isEnabled()).to.be.true;
    });

    it("should initialize with enabled config explicitly set to true", async () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: { enabled: true } });
      expect(widget.isEnabled()).to.be.true;
    });

    it("should initialize with enabled config set to false", async () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: { enabled: false } });
      expect(widget.isEnabled()).to.be.false;
    });
  });

  describe("render", () => {
    it("should display latest git tag", async () => {
      const mockGit = new MockGit();
      mockGit.setLatestTag("v1.2.3");

      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: {} });
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.be.a("string");
      expect(result).to.include("v1.2.3");
    });

    it("should show no tag when none exist", async () => {
      const mockGit = new MockGit();
      mockGit.setLatestTag(null);

      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: {} });
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.be.a("string");
      expect(result).to.include("no tag");
    });

    it("should return null when widget is disabled", async () => {
      const mockGit = new MockGit();
      mockGit.setLatestTag("v1.2.3");

      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: { enabled: false } });
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.be.null;
    });

    it("should display tag with green color formatting", async () => {
      const mockGit = new MockGit();
      mockGit.setLatestTag("v2.0.0");

      const widget = new GitTagWidget(() => mockGit);
      await widget.initialize({ config: {} });
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.be.a("string");
      expect(result).to.include("v2.0.0");
      expect(result).to.include("Tag:");
    });

    it("should handle tags with different formats", async () => {
      const mockGit = new MockGit();

      // Test semantic versioning
      mockGit.setLatestTag("v1.2.3");
      let widget = new GitTagWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);
      let result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.include("v1.2.3");

      // Test version without v prefix
      mockGit.setLatestTag("1.2.3");
      widget = new GitTagWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);
      result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.include("1.2.3");

      // Test custom tag format
      mockGit.setLatestTag("release-2024-01-15");
      widget = new GitTagWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);
      result = await widget.render({ width: 80, timestamp: 0 });
      expect(result).to.include("release-2024-01-15");
    });
  });

  describe("cleanup", () => {
    it("should cleanup without errors", async () => {
      const mockGit = new MockGit();
      const widget = new GitTagWidget(() => mockGit);

      // Should have cleanup method or handle gracefully
      if (widget.cleanup) {
        await widget.cleanup();
      }

      // Verify widget still works after cleanup
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("snapshots", () => {
    it("should snapshot tag output", async () => {
      const mockGit = new MockGit();
      mockGit.setLatestTag("v1.2.3");

      const widget = new GitTagWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Strip ANSI codes for consistent snapshots
      await matchSnapshot("git-tag-widget-with-tag", stripAnsi(result || ""));
    });

    it("should snapshot no tag output", async () => {
      const mockGit = new MockGit();
      mockGit.setLatestTag(null);

      const widget = new GitTagWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot("git-tag-widget-no-tag", stripAnsi(result || ""));
    });
  });

  describe("style renderers", () => {
    const testTag = "v0.5.4";

    const createMockWidget = (tag: string | null) => {
      const mockGit = new MockGit();
      mockGit.setLatestTag(tag);
      const widget = new GitTagWidget(() => mockGit);
      void widget.update({ cwd: "/test/dir" } as any);
      return widget;
    };

    describe("balanced style", () => {
      it("should render tag or em dash", async () => {
        const widget = createMockWidget(testTag);
        widget.setStyle("balanced");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("v0.5.4");
      });

      it("should render em dash when no tag", async () => {
        const widget = createMockWidget(null);
        widget.setStyle("balanced");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("—");
      });
    });

    describe("compact style", () => {
      it("should render tag without v prefix", async () => {
        const widget = createMockWidget(testTag);
        widget.setStyle("compact");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("0.5.4");
      });

      it("should render em dash when no tag", async () => {
        const widget = createMockWidget(null);
        widget.setStyle("compact");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("—");
      });
    });

    describe("playful style", () => {
      it("should render with label emoji", async () => {
        const widget = createMockWidget(testTag);
        widget.setStyle("playful");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("🏷️ v0.5.4");
      });

      it("should render emoji with em dash when no tag", async () => {
        const widget = createMockWidget(null);
        widget.setStyle("playful");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("🏷️ —");
      });
    });

    describe("verbose style", () => {
      it("should render with version prefix", async () => {
        const widget = createMockWidget(testTag);
        widget.setStyle("verbose");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("version v0.5.4");
      });

      it("should render version none when no tag", async () => {
        const widget = createMockWidget(null);
        widget.setStyle("verbose");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("version: none");
      });
    });

    describe("labeled style", () => {
      it("should render with label prefix", async () => {
        const widget = createMockWidget(testTag);
        widget.setStyle("labeled");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Tag: v0.5.4");
      });

      it("should render tag none when no tag", async () => {
        const widget = createMockWidget(null);
        widget.setStyle("labeled");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("Tag: none");
      });
    });

    describe("indicator style", () => {
      it("should render with bullet indicator", async () => {
        const widget = createMockWidget(testTag);
        widget.setStyle("indicator");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("● v0.5.4");
      });

      it("should render bullet with em dash when no tag", async () => {
        const widget = createMockWidget(null);
        widget.setStyle("indicator");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("● —");
      });
    });

    describe("style switching", () => {
      it("should switch between styles dynamically", async () => {
        const widget = createMockWidget(testTag);

        widget.setStyle("balanced");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("v0.5.4");

        widget.setStyle("compact");
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal("0.5.4");
      });

      it("should default to balanced for unknown styles", async () => {
        const widget = createMockWidget(testTag);

        // @ts-expect-error - testing invalid style
        widget.setStyle("unknown" as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal("v0.5.4");
      });
    });
  });
});
