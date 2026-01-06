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
});
