import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StdinData, ModelInfo, GitInfo, RenderContext } from '../../src/types.js';

describe('StdinData', () => {
  it('should accept valid stdin data structure', () => {
    const mockData: StdinData = {
      session_id: 'test-session-123',
      cwd: '/Users/test/project',
      model: {
        id: 'claude-opus-4-5',
        display_name: 'Opus 4.5'
      }
    };

    assert.strictEqual(mockData.session_id, 'test-session-123');
    assert.strictEqual(mockData.cwd, '/Users/test/project');
    assert.strictEqual(mockData.model.id, 'claude-opus-4-5');
  });

  it('should accept ModelInfo structure', () => {
    const model: ModelInfo = {
      id: 'claude-opus-4-5',
      display_name: 'Opus 4.5'
    };

    assert.strictEqual(model.id, 'claude-opus-4-5');
    assert.strictEqual(model.display_name, 'Opus 4.5');
  });

  it('should accept GitInfo structure', () => {
    const git: GitInfo = {
      branch: 'main',
      isRepo: true
    };

    assert.strictEqual(git.branch, 'main');
    assert.strictEqual(git.isRepo, true);
  });

  it('should accept RenderContext structure', () => {
    const context: RenderContext = {
      width: 80,
      timestamp: Date.now()
    };

    assert.strictEqual(context.width, 80);
    assert.ok(typeof context.timestamp === 'number');
  });
});
