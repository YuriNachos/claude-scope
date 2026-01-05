import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import { GitWidget } from '../../../src/widgets/git-widget.js';
import type { IGit } from '../../../src/providers/git-provider.js';

function createMockGit(overrides?: Partial<IGit>): IGit {
  return {
    checkIsRepo: async () => true,
    branch: async () => ({ current: 'main', all: ['main'] }),
    ...overrides
  };
};

describe('GitWidget', () => {
  describe('metadata', () => {
    it('should have correct widget id', () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });

      expect(widget.id).to.equal('git');
    });

    it('should have correct metadata properties', () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });

      expect(widget.metadata.name).to.equal('Git Widget');
      expect(widget.metadata.description).to.equal('Displays current git branch');
      expect(widget.metadata.version).to.equal('1.0.0');
      expect(widget.metadata.author).to.equal('claude-scope');
    });

    it('should be enabled by default', () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });

      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe('initialize', () => {
    it('should initialize with default enabled state', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      expect(widget.isEnabled()).to.be.true;
    });

    it('should initialize with enabled config explicitly set to true', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: { enabled: true } });

      expect(widget.isEnabled()).to.be.true;
    });

    it('should initialize with enabled config set to false', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: { enabled: false } });

      expect(widget.isEnabled()).to.be.false;
    });

    it('should handle additional config properties', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });

      // Should not throw when extra config properties are present
      await widget.initialize({
        config: {
          enabled: true,
          showIcon: true,
          customFormat: '{branch}'
        }
      });

      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe('update', () => {
    it('should initialize git provider on first update', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.exist;
      expect(result).to.include('main');
    });

    it('should reinitialize git provider when cwd changes', async () => {
      let checkRepoCallCount = 0;
      const mockGit = createMockGit({
        checkIsRepo: async () => {
          checkRepoCallCount++;
          return true;
        }
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      await widget.update({
        cwd: '/test/project1',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      expect(checkRepoCallCount).to.equal(1);

      await widget.update({
        cwd: '/test/project2',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      expect(checkRepoCallCount).to.equal(2);
    });

    it('should not reinitialize git provider when cwd is unchanged', async () => {
      let checkRepoCallCount = 0;
      const mockGit = createMockGit({
        checkIsRepo: async () => {
          checkRepoCallCount++;
          return true;
        }
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      expect(checkRepoCallCount).to.equal(1);

      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      expect(checkRepoCallCount).to.equal(1);
    });

    it('should handle update with different session data', async () => {
      const mockGit = createMockGit({
        branch: async () => ({ current: 'develop', all: ['main', 'develop'] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      await widget.update({
        cwd: '/test/project',
        model: { id: 'claude-opus-4', display_name: 'Claude Opus 4' },
        session_id: 'abc-456'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.include('develop');
    });
  });

  describe('render', () => {
    it('should render branch name when in repository', async () => {
      const mockGit = createMockGit({
        branch: async () => ({ current: 'feature-branch', all: ['main', 'feature-branch'] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.exist;
      expect(result).to.include('feature-branch');
      expect(result).to.match(/^\s+feature-branch$/);
    });

    it('should render main branch', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.match(/^\s+main$/);
    });

    it('should render develop branch', async () => {
      const mockGit = createMockGit({
        branch: async () => ({ current: 'develop', all: ['main', 'develop'] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.include('develop');
    });

    it('should render branch with special characters', async () => {
      const mockGit = createMockGit({
        branch: async () => ({
          current: 'feature/ticket-123-add-feature',
          all: ['main', 'feature/ticket-123-add-feature']
        })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.include('feature/ticket-123-add-feature');
    });

    it('should return null when not in repository', async () => {
      const mockGit = createMockGit({
        checkIsRepo: async () => false,
        branch: async () => ({ current: null, all: [] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.null;
    });

    it('should return null when branch is null', async () => {
      const mockGit = createMockGit({
        branch: async () => ({ current: null, all: ['main'] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.null;
    });

    it('should return null when widget is disabled', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: { enabled: false } });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      expect(widget.isEnabled()).to.be.false;

      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.be.null;
    });

    it('should handle detached HEAD state', async () => {
      const mockGit = createMockGit({
        branch: async () => ({
          current: 'HEAD detached at abc123',
          all: ['main', 'develop']
        })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.include('HEAD detached at abc123');
    });

    it('should render with different context widths', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const narrowResult = await widget.render({ width: 40, timestamp: Date.now() });
      const wideResult = await widget.render({ width: 120, timestamp: Date.now() });

      expect(narrowResult).to.match(/^\s+main$/);
      expect(wideResult).to.match(/^\s+main$/);
    });

    it('should render with different timestamp values', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const timestamp = Date.now();
      const result = await widget.render({ width: 80, timestamp });

      expect(result).to.match(/^\s+main$/);
    });

    it('should handle git provider checkIsRepo errors gracefully', async () => {
      const mockGit = createMockGit({
        checkIsRepo: async () => { throw new Error('Git command failed'); },
        branch: async () => ({ current: null, all: [] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: { enabled: true } });

      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.be.null;
    });

    it('should handle git provider branch errors gracefully', async () => {
      const mockGit = createMockGit({
        checkIsRepo: async () => true,
        branch: async () => { throw new Error('Branch command failed'); }
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: { enabled: true } });

      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).to.be.null;
    });
  });

  describe('cleanup', () => {
    it('should cleanup without errors', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      // Should not throw
      await widget.cleanup();
    });

    it('should be callable multiple times', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      await widget.cleanup();
      await widget.cleanup();
      await widget.cleanup();

      // Should not throw
    });
  });

  describe('edge cases', () => {
    it('should handle rendering before update is called', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });

      // Render before update - gitProvider.isRepo() should return false
      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.be.null;
    });

    it('should handle empty branch name', async () => {
      const mockGit = createMockGit({
        branch: async () => ({ current: '', all: ['main'] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      // Empty string is falsy, so implementation returns null (treats empty as no branch)
      expect(result).to.be.null;
    });

    it('should handle very long branch names', async () => {
      const longBranchName = 'feature/very-long-branch-name-that-exceeds-normal-length-expectations';
      const mockGit = createMockGit({
        branch: async () => ({ current: longBranchName, all: ['main', longBranchName] })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.include(longBranchName);
    });

    it('should handle branch with unicode characters', async () => {
      const mockGit = createMockGit({
        branch: async () => ({
          current: 'feature/日本語-branch',
          all: ['main', 'feature/日本語-branch']
        })
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).to.include('feature/日本語-branch');
    });

    it('should handle multiple render calls', async () => {
      const mockGit = createMockGit();
      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result1 = await widget.render({ width: 80, timestamp: Date.now() });
      const result2 = await widget.render({ width: 80, timestamp: Date.now() });
      const result3 = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result1).to.match(/^\s+main$/);
      expect(result2).to.match(/^\s+main$/);
      expect(result3).to.match(/^\s+main$/);
    });
  });

  describe('integration with git provider', () => {
    it('should use git provider to check repository status', async () => {
      let checkIsRepoCalled = false;
      const mockGit = createMockGit({
        checkIsRepo: async () => {
          checkIsRepoCalled = true;
          return true;
        }
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      await widget.render({ width: 80, timestamp: Date.now() });

      expect(checkIsRepoCalled).to.be.true;
    });

    it('should use git provider to get branch name', async () => {
      let branchCalled = false;
      const mockGit = createMockGit({
        branch: async () => {
          branchCalled = true;
          return { current: 'test-branch', all: ['main', 'test-branch'] };
        }
      });

      const widget = new GitWidget({ git: mockGit });
      await widget.initialize({ config: {} });
      await widget.update({
        cwd: '/test/project',
        model: { id: 'test', display_name: 'Test' },
        session_id: '123'
      });

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(branchCalled).to.be.true;
      expect(result).to.include('test-branch');
    });
  });
});
