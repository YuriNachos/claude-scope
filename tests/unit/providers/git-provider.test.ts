import { describe, it } from 'node:test';
import { expect } from 'chai';
import { GitProvider } from '../../../src/providers/git-provider.js';

describe('GitProvider', () => {
  it('should return branch name when in git repository', async () => {
    const mockGit = {
      checkIsRepo: async () => true,
      branch: async () => ({ current: 'main', all: ['main'] })
    };

    const provider = new GitProvider({ git: mockGit as any });
    await provider.init('/test/project');

    const result = await provider.getBranch();

    expect(result).to.equal('main');
  });

  it('should return null when not in git repository', async () => {
    const mockGit = {
      checkIsRepo: async () => false,
      branch: async () => ({ current: null, all: [] })
    };

    const provider = new GitProvider({ git: mockGit as any });
    await provider.init('/test/project');

    const result = await provider.getBranch();

    expect(result).to.be.null;
  });

  it('should return isRepo correctly', async () => {
    const mockGit = {
      checkIsRepo: async () => true
    };

    const provider = new GitProvider({ git: mockGit as any });
    await provider.init('/test/project');

    expect(provider.isRepo()).to.be.true;
  });
});
