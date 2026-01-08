/**
 * Unit tests for GitChangesWidget
 *
 * Uses MockGit for fast, deterministic testing without real git operations
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { GitChangesWidget } from '../../../src/widgets/git/git-changes-widget.js';
import { MockGit } from '../../fixtures/mock-git.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

describe('GitChangesWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new GitChangesWidget();
    expect(widget.id).to.equal('git-changes');
    expect(widget.metadata.name).to.equal('Git Changes');
  });

  it('should display both additions and deletions', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([
      { file: 'test.txt', insertions: 5, deletions: 3 },
    ]);

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.a('string');
    expect(result).to.include('+5');
    expect(result).to.include('-3');
  });

  it('should display only additions', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([
      { file: 'test.txt', insertions: 10, deletions: 0 },
    ]);

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.a('string');
    expect(result).to.include('+10');
    expect(result).to.not.include('-');
  });

  it('should display only deletions', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([
      { file: 'test.txt', insertions: 0, deletions: 7 },
    ]);

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.a('string');
    expect(result).to.include('-7');
    expect(result).to.not.include('+');
  });

  it('should return null when no changes', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([]); // No changes

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should return null when cwd not set', async () => {
    const mockGit = new MockGit();
    const widget = new GitChangesWidget(() => mockGit);

    // Don't call update, so git instance is not initialized
    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should return null when widget is disabled', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([{ file: 'test.txt', insertions: 5, deletions: 3 }]);

    const widget = new GitChangesWidget(() => mockGit);
    await widget.initialize({ config: { enabled: false } });
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should handle non-git directory gracefully', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([]); // Simulate no git repo (no changes)

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/non-git-dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should aggregate changes from multiple files', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([
      { file: 'file1.txt', insertions: 5, deletions: 2 },
      { file: 'file2.txt', insertions: 3, deletions: 1 },
      { file: 'file3.ts', insertions: 10, deletions: 0 },
    ]);

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.a('string');
    expect(result).to.include('+18'); // 5 + 3 + 10
    expect(result).to.include('-3'); // 2 + 1
  });

  it('should handle zero insertions with deletions', async () => {
    const mockGit = new MockGit();
    mockGit.setDiff([
      { file: 'test.txt', insertions: 0, deletions: 5 },
    ]);

    const widget = new GitChangesWidget(() => mockGit);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('-5');
  });

  it('should handle multiple updates', async () => {
    const mockGit = new MockGit();
    const widget = new GitChangesWidget(() => mockGit);

    // First update with changes
    mockGit.setDiff([{ file: 'test.txt', insertions: 5, deletions: 3 }]);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    let result = await widget.render({ width: 80, timestamp: 0 });
    expect(result).to.include('+5');
    expect(result).to.include('-3');

    // Second update with no changes
    mockGit.setDiff([]);
    await widget.update(createMockStdinData({ cwd: '/test/dir' }));

    result = await widget.render({ width: 80, timestamp: 0 });
    expect(result).to.be.null;
  });

  describe('style renderers', () => {
    const createMockWidget = (insertions: number, deletions: number) => {
      const mockGit = new MockGit();
      mockGit.setDiff([{ file: 'test.txt', insertions, deletions }]);
      const widget = new GitChangesWidget(() => mockGit);
      void widget.update(createMockStdinData({ cwd: '/test/dir' }));
      return widget;
    };

    describe('balanced style', () => {
      it('should render with space separator', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('balanced');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('+142 -27');
      });

      it('should show only insertions when no deletions', async () => {
        const widget = createMockWidget(142, 0);
        widget.setStyle('balanced');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('+142');
      });

      it('should show only deletions when no insertions', async () => {
        const widget = createMockWidget(0, 27);
        widget.setStyle('balanced');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('-27');
      });
    });

    describe('compact style', () => {
      it('should render with slash separator', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('compact');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('+142/-27');
      });
    });

    describe('playful style', () => {
      it('should render with arrow emojis', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('playful');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('⬆142 ⬇27');
      });
    });

    describe('verbose style', () => {
      it('should render with full text', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('verbose');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('+142 insertions, -27 deletions');
      });
    });

    describe('technical style', () => {
      it('should render raw numbers with slash', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('technical');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('142/27');
      });
    });

    describe('symbolic style', () => {
      it('should render with triangle symbols', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('symbolic');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('▲142 ▼27');
      });
    });

    describe('labeled style', () => {
      it('should render with label prefix', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('labeled');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('Diff: +142 -27');
      });
    });

    describe('indicator style', () => {
      it('should render with bullet indicator', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('indicator');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('● +142 -27');
      });
    });

    describe('fancy style', () => {
      it('should render with angle brackets and pipe', async () => {
        const widget = createMockWidget(142, 27);
        widget.setStyle('fancy');

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('⟨+142|-27⟩');
      });
    });

    describe('style switching', () => {
      it('should switch between styles dynamically', async () => {
        const widget = createMockWidget(142, 27);

        widget.setStyle('balanced');
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal('+142 -27');

        widget.setStyle('compact');
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal('+142/-27');

        widget.setStyle('fancy');
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal('⟨+142|-27⟩');
      });

      it('should default to balanced for unknown styles', async () => {
        const widget = createMockWidget(142, 27);

        // @ts-expect-error - testing invalid style
        widget.setStyle('unknown' as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('+142 -27');
      });
    });
  });
});
