/**
 * Unit tests for GitWidget
 *
 * Uses MockGit for fast, deterministic testing without real git operations
 */

import { describe, it } from "node:test";
import { expect } from "chai";
import { GitWidget } from "../../../src/widgets/git/git-widget.js";
import { MockGit } from "../../fixtures/mock-git.js";
import { matchSnapshot, stripAnsi } from "../../helpers/snapshot.js";

describe("GitWidget", () => {
  describe("metadata", () => {
    it("should have correct widget id", () => {
      const widget = new GitWidget();
      expect(widget.id).to.equal("git");
    });

    it("should have correct metadata properties", () => {
      const widget = new GitWidget();
      expect(widget.metadata.name).to.equal("Git Widget");
      expect(widget.metadata.description).to.equal("Displays current git branch");
      expect(widget.metadata.version).to.equal("1.0.0");
      expect(widget.metadata.author).to.equal("claude-scope");
    });

    it("should be enabled by default", () => {
      const widget = new GitWidget();
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("initialize", () => {
    it("should initialize with default enabled state", async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: {} });
      expect(widget.isEnabled()).to.be.true;
    });

    it("should initialize with enabled config explicitly set to true", async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: { enabled: true } });
      expect(widget.isEnabled()).to.be.true;
    });

    it("should initialize with enabled config set to false", async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: { enabled: false } });
      expect(widget.isEnabled()).to.be.false;
    });
  });

  describe("update", () => {
    it("should update cwd and initialize git instance", async () => {
      const mockGit = new MockGit();
      const widget = new GitWidget(() => mockGit);

      await widget.update({ cwd: "/test/dir" } as any);

      // Widget should now be tracking /test/dir
      expect(widget.isEnabled()).to.be.true;
    });

    it("should handle multiple updates with same cwd", async () => {
      const mockGit = new MockGit();
      const widget = new GitWidget(() => mockGit);

      await widget.update({ cwd: "/test/dir" } as any);
      await widget.update({ cwd: "/test/dir" } as any);
      await widget.update({ cwd: "/test/dir" } as any);

      // Should handle gracefully
      expect(widget.isEnabled()).to.be.true;
    });

    it("should handle updates with different cwd", async () => {
      const mockGit1 = new MockGit();
      const mockGit2 = new MockGit();
      let callCount = 0;
      const widget = new GitWidget((cwd) => {
        callCount++;
        return cwd === "/test/dir1" ? mockGit1 : mockGit2;
      });

      await widget.update({ cwd: "/test/dir1" } as any);
      expect(callCount).to.equal(1);

      await widget.update({ cwd: "/test/dir2" } as any);
      expect(callCount).to.equal(2);

      // Widget should still be enabled
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("render", () => {
    it("should render branch name when on main branch", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("main");

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a("string");
      expect(stripAnsi(result || "")).to.include("main");
    });

    it("should render custom branch name", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("feature/test-branch");

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a("string");
      expect(stripAnsi(result || "")).to.include("feature/test-branch");
    });

    it("should return null when not in git repo", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch(null); // Simulate no git repo

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/non-git-dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should return null when cwd not set", async () => {
      const mockGit = new MockGit();
      const widget = new GitWidget(() => mockGit);

      // Don't call update, so git instance is not initialized
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should return null when widget is disabled", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("main");

      const widget = new GitWidget(() => mockGit);
      await widget.initialize({ config: { enabled: false } });
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it("should render branch name without leading space", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("develop");

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a("string");
      expect(stripAnsi(result || "")).to.equal("develop"); // No leading space
    });

    it("should handle detached HEAD state (commit hash)", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("abc123def"); // Simulate detached HEAD

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should handle detached HEAD - may return commit hash
      expect(result).to.be.a("string");
      expect(stripAnsi(result || "")).to.include("abc123def");
    });
  });

  describe("cleanup", () => {
    it("should cleanup without errors", async () => {
      const widget = new GitWidget();

      // Should have cleanup method or handle gracefully
      if (widget.cleanup) {
        await widget.cleanup();
      }

      // Verify widget still works after cleanup
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe("snapshots", () => {
    it("should snapshot main branch output", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("main");

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Strip ANSI codes for consistent snapshots
      await matchSnapshot("git-widget-main-branch", stripAnsi(result || ""));
    });

    it("should snapshot feature branch output", async () => {
      const mockGit = new MockGit();
      mockGit.setBranch("feature/snapshot-test");

      const widget = new GitWidget(() => mockGit);
      await widget.update({ cwd: "/test/dir" } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot("git-widget-feature-branch", stripAnsi(result || ""));
    });
  });

  describe("style renderers", () => {
    const testBranch = "main";

    const createMockWidget = (branch: string) => {
      const mockGit = new MockGit();
      mockGit.setBranch(branch);
      const widget = new GitWidget(() => mockGit);
      void widget.update({ cwd: "/test/dir" } as any);
      return widget;
    };

    describe("balanced style", () => {
      it("should render branch name", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("balanced");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("main");
      });
    });

    describe("compact style", () => {
      it("should render branch name (same as balanced)", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("compact");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("main");
      });
    });

    describe("playful style", () => {
      it("should render with branch emoji", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("playful");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("🔀 main");
      });
    });

    describe("verbose style", () => {
      it("should render with full branch info", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("verbose");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("branch: main (HEAD)");
      });
    });

    describe("indicator style", () => {
      it("should render with bullet indicator", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("indicator");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("● main");
      });
    });

    describe("labeled style", () => {
      it("should render with label prefix", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("labeled");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("Git: main");
      });
    });

    describe("minimal style", () => {
      it("should render branch name only (never shows changes)", async () => {
        const widget = createMockWidget(testBranch);
        widget.setStyle("minimal");

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("main");
      });
    });

    describe("style switching", () => {
      it("should switch between styles dynamically", async () => {
        const widget = createMockWidget(testBranch);

        widget.setStyle("balanced");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "main"
        );

        widget.setStyle("playful");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "🔀 main"
        );

        widget.setStyle("minimal");
        expect(stripAnsi((await widget.render({ width: 80, timestamp: 0 })) || "")).to.equal(
          "main"
        );
      });

      it("should default to balanced for unknown styles", async () => {
        const widget = createMockWidget(testBranch);

        // @ts-expect-error - testing invalid style
        widget.setStyle("unknown" as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(stripAnsi(result || "")).to.equal("main");
      });
    });

    describe("with changes", () => {
      const createMockWidgetWithChanges = (
        branch: string,
        files: number,
        insertions: number,
        deletions: number
      ) => {
        const mockGit = new MockGit();
        mockGit.setBranch(branch);
        // Create array of files with distributed insertions/deletions
        const diffFiles: Array<{ file: string; insertions: number; deletions: number }> = [];
        const insertionsPerFile = Math.floor(insertions / files);
        const deletionsPerFile = Math.floor(deletions / files);
        const remainingInsertions = insertions % files;
        const remainingDeletions = deletions % files;

        for (let i = 0; i < files; i++) {
          diffFiles.push({
            file: `test${i}.ts`,
            insertions: insertionsPerFile + (i < remainingInsertions ? 1 : 0),
            deletions: deletionsPerFile + (i < remainingDeletions ? 1 : 0),
          });
        }
        mockGit.setDiff(diffFiles);

        const widget = new GitWidget(() => mockGit);
        void widget.update({ cwd: "/test/dir" } as any);
        return widget;
      };

      describe("balanced style", () => {
        it("should render branch with changes", async () => {
          const widget = createMockWidgetWithChanges("main", 1, 42, 18);
          widget.setStyle("balanced");

          const result = await widget.render({ width: 80, timestamp: 0 });

          expect(stripAnsi(result || "")).to.equal("main [+42 -18]");
        });

        it("should render branch with only insertions", async () => {
          const widget = createMockWidgetWithChanges("main", 1, 42, 0);
          widget.setStyle("balanced");

          const result = await widget.render({ width: 80, timestamp: 0 });

          expect(stripAnsi(result || "")).to.equal("main [+42]");
        });

        it("should render branch with only deletions", async () => {
          const widget = createMockWidgetWithChanges("main", 1, 0, 18);
          widget.setStyle("balanced");

          const result = await widget.render({ width: 80, timestamp: 0 });

          expect(stripAnsi(result || "")).to.equal("main [-18]");
        });
      });

      describe("compact style", () => {
        it("should render branch with changes in compact format", async () => {
          const widget = createMockWidgetWithChanges("main", 1, 42, 18);
          widget.setStyle("compact");

          const result = await widget.render({ width: 80, timestamp: 0 });

          expect(stripAnsi(result || "")).to.equal("main +42/-18");
        });
      });

      describe("labeled style", () => {
        it("should render branch with changes and file count", async () => {
          const widget = createMockWidgetWithChanges("main", 3, 42, 18);
          widget.setStyle("labeled");

          const result = await widget.render({ width: 80, timestamp: 0 });

          expect(stripAnsi(result || "")).to.equal("Git: main [3 files: +42/-18]");
        });
      });
    });
  });
});
