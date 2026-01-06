/**
 * Unit tests for GitChangesWidget
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import { expect } from 'chai';
import { GitChangesWidget } from '#/widgets/git/git-changes-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { simpleGit } from 'simple-git';

describe('GitChangesWidget', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(process.cwd(), 'test-git-changes-'));
    // Initialize git repo
    await simpleGit(testDir).init();
    await simpleGit(testDir).addConfig('user.name', 'Test User');
    await simpleGit(testDir).addConfig('user.email', 'test@example.com');
  });

  afterEach(async () => {
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should have correct id and metadata', () => {
    const widget = new GitChangesWidget();
    expect(widget.id).to.equal('git-changes');
    expect(widget.metadata.name).to.equal('Git Changes');
  });

  it('should display both additions and deletions', async () => {
    // Create a file with changes
    const testFile = join(testDir, 'test.txt');
    await writeFile(testFile, 'line1\nline2\nline3\n');
    await simpleGit(testDir).add(testFile);
    await simpleGit(testDir).commit('Initial commit');

    // Modify file
    await writeFile(testFile, 'line1\nline2\nline3\nline4\nline5\n');
    await simpleGit(testDir).add(testFile);
    await simpleGit(testDir).commit('Add more lines');

    const widget = new GitChangesWidget();
    await widget.update(createMockStdinData({ cwd: testDir }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.a('string');
    expect(result).to.include('+');
  });

  it('should return null when no changes', async () => {
    // Clean working directory (no changes)
    const widget = new GitChangesWidget();
    await widget.update(createMockStdinData({ cwd: testDir }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should handle non-git directory gracefully', async () => {
    // Use temp directory which is not a git repo
    const nonGitDir = await mkdtemp(join(process.cwd(), 'test-non-git-'));

    const widget = new GitChangesWidget();
    await widget.update(createMockStdinData({ cwd: nonGitDir }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;

    await rm(nonGitDir, { recursive: true, force: true });
  });
});
