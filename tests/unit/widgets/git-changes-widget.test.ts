/**
 * Unit tests for GitChangesWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { GitChangesWidget } from '../../../src/widgets/git-changes-widget.js';
import type { IGit } from '../../../src/providers/git-provider.js';
import type { StdinData } from '../../../src/types.js';

// Mock git provider
function createMockGit(overrides: Partial<IGit> = {}): IGit {
  return {
    checkIsRepo: async () => true,
    branch: async () => ({ current: 'main', all: ['main'] }),
    diffStats: async () => ({ insertions: 42, deletions: 10 }),
    ...overrides
  };
}

function createMockStdinData(overrides: Partial<StdinData> = {}): StdinData {
  return {
    hook_event_name: 'Status',
    session_id: 'test-session',
    transcript_path: '/test/transcript.json',
    cwd: '/test/project',
    model: { id: 'test-model', display_name: 'Test Model' },
    workspace: { current_dir: '/test/project', project_dir: '/test/project' },
    version: '1.0.0',
    output_style: { name: 'default' },
    cost: {
      total_cost_usd: 0.01,
      total_duration_ms: 60000,
      total_api_duration_ms: 5000,
      total_lines_added: 10,
      total_lines_removed: 5
    },
    context_window: {
      total_input_tokens: 1000,
      total_output_tokens: 500,
      context_window_size: 200000,
      current_usage: {
        input_tokens: 500,
        output_tokens: 250,
        cache_creation_input_tokens: 100,
        cache_read_input_tokens: 50
      }
    },
    ...overrides
  };
}

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
