import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import { GitProvider } from '../../../src/providers/git-provider.js';
import type { IGit } from '../../../src/providers/git-provider.js';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('GitProvider', () => {
  describe('init', () => {
    it('should initialize with repository path', async () => {
      const mockGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit as any });
      await provider.init('/test/project');

      expect(provider.isRepo()).to.be.true;
    });

    it('should set isRepo to false for non-git directory', async () => {
      const mockGit = {
        checkIsRepo: async () => false,
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit as any });
      await provider.init('/test/non-repo');

      expect(provider.isRepo()).to.be.false;
    });
  });

  describe('checkIsRepo', () => {
    it('should return true for valid git repository', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      expect(provider.isRepo()).to.be.true;
    });

    it('should return false for non-git directory', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => false,
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/non-repo');

      expect(provider.isRepo()).to.be.false;
    });
  });

  describe('getBranch', () => {
    it('should return branch name when in git repository', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.equal('main');
    });

    it('should return null when not in git repository', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => false,
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.be.null;
    });

    it('should handle detached HEAD state', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({
          current: 'HEAD detached at abc123',
          all: ['main', 'develop']
        })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.equal('HEAD detached at abc123');
    });

    it('should return null for detached HEAD without commit ref', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({
          current: null,
          all: ['main', 'develop']
        })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.be.null;
    });

    it('should handle branch names with special characters', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({
          current: 'feature/ticket-123-add-feature',
          all: ['main', 'feature/ticket-123-add-feature']
        })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.equal('feature/ticket-123-add-feature');
    });
  });

  describe('branch', () => {
    it('should return current and all branches', async () => {
      const fixtureData = {
        current: 'main',
        all: ['main', 'develop', 'feature-branch']
      };

      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => fixtureData
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.equal('main');
    });

    it('should return branch data from fixture file', async () => {
      const fixturePath = join(process.cwd(), 'tests/fixtures/git-data.json');
      const fixtureData = JSON.parse(readFileSync(fixturePath, 'utf-8'));

      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => fixtureData
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.equal('main');
    });
  });

  describe('isRepo', () => {
    it('should return true after initialization in git repository', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      expect(provider.isRepo()).to.be.true;
    });

    it('should return false after initialization in non-repo directory', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => false,
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/non-repo');

      expect(provider.isRepo()).to.be.false;
    });

    it('should return false before initialization', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit });

      expect(provider.isRepo()).to.be.false;
    });
  });

  describe('getInfo', () => {
    it('should return complete git info for repository', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'feature', all: ['main', 'feature'] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const info = await provider.getInfo();

      expect(info.branch).to.equal('feature');
      expect(info.isRepo).to.be.true;
    });

    it('should return git info when not in repository', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => false,
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const info = await provider.getInfo();

      expect(info.branch).to.be.null;
      expect(info.isRepo).to.be.false;
    });

    it('should include detached HEAD state in info', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({
          current: 'HEAD detached at abc123',
          all: ['main']
        })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const info = await provider.getInfo();

      expect(info.branch).to.equal('HEAD detached at abc123');
      expect(info.isRepo).to.be.true;
    });
  });

  describe('error handling', () => {
    it('should handle git operation failures gracefully', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => {
          throw new Error('Git operation failed');
        },
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit });

      try {
        await provider.init('/test/project');
        throw new Error('Expected init to throw');
      } catch (error) {
        expect((error as Error).message).to.equal('Git operation failed');
      }
    });

    it('should handle branch operation failures gracefully', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => {
          throw new Error('Branch operation failed');
        }
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      try {
        await provider.getBranch();
        throw new Error('Expected getBranch to throw');
      } catch (error) {
        expect((error as Error).message).to.equal('Branch operation failed');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty branch list', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: null, all: [] })
      };

      const provider = new GitProvider({ git: mockGit });
      await provider.init('/test/project');

      const result = await provider.getBranch();

      expect(result).to.be.null;
    });

    it('should handle multiple initializations', async () => {
      const mockGit: IGit = {
        checkIsRepo: async () => true,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit });

      await provider.init('/test/project1');
      expect(provider.isRepo()).to.be.true;

      await provider.init('/test/project2');
      expect(provider.isRepo()).to.be.true;
    });

    it('should handle switching from repo to non-repo', async () => {
      let isRepoResult = true;
      const mockGit: IGit = {
        checkIsRepo: async () => isRepoResult,
        branch: async () => ({ current: 'main', all: ['main'] })
      };

      const provider = new GitProvider({ git: mockGit });

      await provider.init('/test/repo');
      expect(provider.isRepo()).to.be.true;

      isRepoResult = false;
      await provider.init('/test/non-repo');
      expect(provider.isRepo()).to.be.false;
    });
  });
});
