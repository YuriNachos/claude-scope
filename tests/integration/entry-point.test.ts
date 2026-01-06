import { describe, it } from 'node:test';
import { expect } from 'chai';
import { simpleGit } from 'simple-git';
import { main } from '#/index.js';

describe('Entry Point Integration', () => {
  it('should output git branch for current repository', async () => {
    // This test assumes we're in a git repository
    const git = simpleGit();
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      console.log('Skipping: not in a git repository');
      return;
    }

    const branch = await git.branch();
    const output = await main();

    expect(output).to.include(branch.current);
  });
});
