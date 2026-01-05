import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GitWidget } from '../../../src/widgets/git-widget.js';
import type { IGit } from '../../providers/git-provider.js';

describe('GitWidget', () => {
  it('should render branch name when in repository', async () => {
    const mockGit: IGit = {
      checkIsRepo: async () => true,
      branch: async () => ({ current: 'feature-branch', all: ['main', 'feature-branch'] })
    };

    const widget = new GitWidget({ git: mockGit });
    await widget.initialize({});
    await widget.update({ cwd: '/test/project', model: { id: 'test', display_name: 'Test' }, session_id: '123' });

    const result = await widget.render({ width: 80, timestamp: Date.now() });

    assert.ok(result);
    assert.ok(result!.includes('feature-branch'));
  });

  it('should return null when not in repository', async () => {
    const mockGit: IGit = {
      checkIsRepo: async () => false,
      branch: async () => ({ current: null, all: [] })
    };

    const widget = new GitWidget({ git: mockGit });
    await widget.initialize({});
    await widget.update({ cwd: '/test/project', model: { id: 'test', display_name: 'Test' }, session_id: '123' });

    const result = await widget.render({ width: 80, timestamp: Date.now() });

    assert.strictEqual(result, null);
  });

  it('should have correct metadata', () => {
    const widget = new GitWidget({ git: {} as any });

    assert.strictEqual(widget.id, 'git');
    assert.strictEqual(widget.metadata.name, 'Git Widget');
    assert.strictEqual(widget.isEnabled(), true);
  });
});
