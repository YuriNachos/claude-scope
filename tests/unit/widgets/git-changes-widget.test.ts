/**
 * Unit tests for GitChangesWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { GitChangesWidget } from '../../../src/widgets/git-changes-widget.js';
import { createMockGit, createMockStdinData } from '../../fixtures/mock-data.js';

describe('GitChangesWidget', () => {
  it('should have correct id and metadata', () => {
    const mockGit = createMockGit();
    const widget = new GitChangesWidget(mockGit);
    expect(widget.id).to.equal('git-changes');
    expect(widget.metadata.name).to.equal('Git Changes');
  });

  it('should display both additions and deletions', async () => {
    const mockGit = createMockGit({
      diffStats: async () => ({ insertions: 42, deletions: 10 })
    });
    const widget = new GitChangesWidget(mockGit);
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('+42,-10');
  });

  it('should display only additions', async () => {
    const mockGit = createMockGit({
      diffStats: async () => ({ insertions: 100, deletions: 0 })
    });
    const widget = new GitChangesWidget(mockGit);
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('+100');
  });

  it('should display only deletions', async () => {
    const mockGit = createMockGit({
      diffStats: async () => ({ insertions: 0, deletions: 50 })
    });
    const widget = new GitChangesWidget(mockGit);
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('-50');
  });

  it('should return null when no changes', async () => {
    const mockGit = createMockGit({
      diffStats: async () => ({ insertions: 0, deletions: 0 })
    });
    const widget = new GitChangesWidget(mockGit);
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should return null when not a git repo', async () => {
    const mockGit = createMockGit({
      diffStats: async () => null
    });
    const widget = new GitChangesWidget(mockGit);
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should handle git errors gracefully', async () => {
    const mockGit = createMockGit({
      diffStats: async () => { throw new Error('Git error'); }
    });
    const widget = new GitChangesWidget(mockGit);
    await widget.update(createMockStdinData());

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });
});
