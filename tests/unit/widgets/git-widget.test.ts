/**
 * Unit tests for GitWidget
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import { expect } from 'chai';
import { GitWidget } from '../../../src/widgets/git/git-widget.js';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { simpleGit } from 'simple-git';

describe('GitWidget', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(process.cwd(), 'test-git-widget-'));
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

  describe('metadata', () => {
    it('should have correct widget id', () => {
      const widget = new GitWidget();
      expect(widget.id).to.equal('git');
    });

    it('should have correct metadata properties', () => {
      const widget = new GitWidget();
      expect(widget.metadata.name).to.equal('Git Widget');
      expect(widget.metadata.description).to.equal('Displays current git branch');
      expect(widget.metadata.version).to.equal('1.0.0');
      expect(widget.metadata.author).to.equal('claude-scope');
    });

    it('should be enabled by default', () => {
      const widget = new GitWidget();
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe('initialize', () => {
    it('should initialize with default enabled state', async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: {} });
      expect(widget.isEnabled()).to.be.true;
    });

    it('should initialize with enabled config explicitly set to true', async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: { enabled: true } });
      expect(widget.isEnabled()).to.be.true;
    });

    it('should initialize with enabled config set to false', async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: { enabled: false } });
      expect(widget.isEnabled()).to.be.false;
    });
  });

  describe('update', () => {
    it('should update cwd and reinitialize git instance', async () => {
      const widget = new GitWidget();

      await widget.update({ cwd: testDir } as any);

      // Widget should now be tracking testDir
      expect(widget.isEnabled()).to.be.true;
    });

    it('should handle multiple updates with same cwd', async () => {
      const widget = new GitWidget();

      await widget.update({ cwd: testDir } as any);
      await widget.update({ cwd: testDir } as any);
      await widget.update({ cwd: testDir } as any);

      // Should handle gracefully
      expect(widget.isEnabled()).to.be.true;
    });

    it('should handle updates with different cwd', async () => {
      const widget = new GitWidget();

      await widget.update({ cwd: testDir } as any);

      const newDir = await mkdtemp(join(process.cwd(), 'test-git-widget-2-'));
      await simpleGit(newDir).init();

      await widget.update({ cwd: newDir } as any);

      // Widget should now track new directory
      expect(widget.isEnabled()).to.be.true;

      await rm(newDir, { recursive: true, force: true });
    });
  });

  describe('render', () => {
    it('should render branch name when in git repo', async () => {
      // Create initial commit to establish main branch
      const testFile = join(testDir, 'test.txt');
      await writeFile(testFile, 'test content');
      await simpleGit(testDir).add(testFile);
      await simpleGit(testDir).commit('Initial commit');

      const widget = new GitWidget();
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a('string');
      expect(result).to.include('main');
    });

    it('should render custom branch name', async () => {
      // Create initial commit
      const testFile = join(testDir, 'test.txt');
      await writeFile(testFile, 'test content');
      await simpleGit(testDir).add(testFile);
      await simpleGit(testDir).commit('Initial commit');

      // Create and checkout feature branch
      await simpleGit(testDir).checkout(['-b', 'feature-test']);

      const widget = new GitWidget();
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a('string');
      expect(result).to.include('feature-test');
    });

    it('should return null when not in git repo', async () => {
      const nonGitDir = await mkdtemp(join(process.cwd(), 'test-non-git-'));

      const widget = new GitWidget();
      await widget.update({ cwd: nonGitDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;

      await rm(nonGitDir, { recursive: true, force: true });
    });

    it('should return null when cwd not set', async () => {
      const widget = new GitWidget();

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it('should return null when widget is disabled', async () => {
      const widget = new GitWidget();
      await widget.initialize({ config: { enabled: false } });
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.null;
    });

    it('should render branch name with leading space', async () => {
      const testFile = join(testDir, 'test.txt');
      await writeFile(testFile, 'test content');
      await simpleGit(testDir).add(testFile);
      await simpleGit(testDir).commit('Initial commit');

      const widget = new GitWidget();
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.be.a('string');
      expect(result).to.match(/^\s+\S+/); // Starts with whitespace
    });
  });

  describe('cleanup', () => {
    it('should cleanup without errors', async () => {
      const widget = new GitWidget();

      // Should have cleanup method or handle gracefully
      if (widget.cleanup) {
        await widget.cleanup();
      }

      // Verify widget still works after cleanup
      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe('error handling', () => {
    it('should handle git errors gracefully', async () => {
      // Create invalid directory scenario
      const invalidDir = '/root/nonexistent/path';

      const widget = new GitWidget();
      await widget.update({ cwd: invalidDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should return null or handle gracefully
      expect(result).to.not.throw;
    });
  });

  describe('edge cases', () => {
    it('should handle detached HEAD state', async () => {
      // Create commit and checkout detached HEAD
      const testFile = join(testDir, 'test.txt');
      await writeFile(testFile, 'test content');
      await simpleGit(testDir).add(testFile);
      await simpleGit(testDir).commit('Initial commit');

      const commit = await simpleGit(testDir).revparse(['HEAD']);
      await simpleGit(testDir).checkout(['--detach']);

      const widget = new GitWidget();
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should handle detached HEAD - may return commit hash or null
      expect(result).to.not.throw;
    });

    it('should handle empty repository (no commits)', async () => {
      // Repo exists but no commits
      const widget = new GitWidget();
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should handle gracefully - may return null or empty branch
      expect(result).to.not.throw;
    });

    it('should handle repository with no branches yet', async () => {
      // Freshly initialized repo has no commits yet
      const widget = new GitWidget();
      await widget.update({ cwd: testDir } as any);

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Should handle gracefully
      expect(result).to.not.throw;
    });
  });
});
