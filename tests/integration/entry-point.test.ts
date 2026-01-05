import { describe, it } from 'node:test';
import assert from 'node:assert';
import { simpleGit } from 'simple-git';
import { main } from '../../src/index.js';

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

    assert.ok(output.includes(branch.current), `Output should contain branch "${branch.current}". Got: ${output}`);
  });
});
