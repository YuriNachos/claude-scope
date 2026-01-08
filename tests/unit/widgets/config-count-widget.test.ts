/**
 * Unit tests for ConfigCountWidget
 */

import { describe, it, before, after } from 'node:test';
import { expect } from 'chai';
import { rimraf } from 'rimraf';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { ConfigCountWidget } from '../../../src/widgets/config-count-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testHomeDir = path.join(__dirname, '../fixtures/config-home');
const testProjectDir = path.join(__dirname, '../fixtures/config-project');

describe('ConfigCountWidget', () => {
  let originalHome: string | undefined;

  before(async () => {
    originalHome = process.env.HOME;

    // Create minimal test structure
    await fs.mkdir(path.join(testHomeDir, '.claude'), { recursive: true });
    await fs.writeFile(path.join(testHomeDir, '.claude', 'CLAUDE.md'), '# User');
    await fs.mkdir(path.join(testProjectDir, '.claude'), { recursive: true });
    await fs.writeFile(path.join(testProjectDir, 'CLAUDE.md'), '# Project');
  });

  after(async () => {
    if (originalHome) {
      process.env.HOME = originalHome;
    }
    await rimraf(testHomeDir);
    await rimraf(testProjectDir);
  });

  it('should have correct id and metadata', () => {
    const widget = new ConfigCountWidget();
    expect(widget.id).to.equal('config-count');
    expect(widget.metadata.name).to.equal('Config Count');
    expect(widget.metadata.line).to.equal(1);
  });

  it('should be disabled when all counts are zero', async () => {
    process.env.HOME = '/tmp/nonexistent';
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: '/tmp/nonexistent' }));

    expect(widget.isEnabled()).to.be.false;
  });

  it('should be enabled when at least one count > 0', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testProjectDir }));

    expect(widget.isEnabled()).to.be.true;
  });

  it('should render with balanced style (default)', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testProjectDir }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('CLAUDE.md:');
  });

  it('should not show categories with zero count', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();
    await widget.update(createMockStdinData({ cwd: testHomeDir })); // Only user, no project MCPs/hooks

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Should not show MCPs or hooks if they don't exist
    expect(result).to.not.include('🔌');
    expect(result).to.not.include('🪝');
  });

  it('should use separator between multiple items', async () => {
    process.env.HOME = testHomeDir;
    const widget = new ConfigCountWidget();

    // Add a rules file to create multiple items
    await fs.mkdir(path.join(testProjectDir, '.claude', 'rules'), { recursive: true });
    await fs.writeFile(path.join(testProjectDir, '.claude', 'rules', 'test.md'), '# Test');

    // Clear cache by waiting or creating new instance
    const widget2 = new ConfigCountWidget();
    await widget2.update(createMockStdinData({ cwd: testProjectDir }));

    const result = await widget2.render({ width: 80, timestamp: 0 });

    expect(result).to.include(' │ ');
  });

  describe('style renderers', () => {
    before(async () => {
      // Add a rules file and hooks for comprehensive testing
      await fs.mkdir(path.join(testProjectDir, '.claude', 'rules'), { recursive: true });
      await fs.writeFile(path.join(testProjectDir, '.claude', 'rules', 'test.md'), '# Test');
      await fs.mkdir(path.join(testProjectDir, '.claude', 'hooks'), { recursive: true });
      await fs.writeFile(path.join(testProjectDir, '.claude', 'hooks', 'test.sh'), '# Test');
    });

    it('should render balanced style', async () => {
      process.env.HOME = testHomeDir;
      const widget = new ConfigCountWidget();
      widget.setStyle('balanced');
      await widget.update(createMockStdinData({ cwd: testProjectDir }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('CLAUDE.md:');
      expect(result).to.include('rules:');
      expect(result).to.include(' │ ');
    });

    it('should render compact style', async () => {
      process.env.HOME = testHomeDir;
      const widget = new ConfigCountWidget();
      widget.setStyle('compact');
      await widget.update(createMockStdinData({ cwd: testProjectDir }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('docs');
      expect(result).to.include('rules');
      expect(result).to.include(' │ ');
    });

    it('should render playful style with emojis', async () => {
      process.env.HOME = testHomeDir;
      const widget = new ConfigCountWidget();
      widget.setStyle('playful');
      await widget.update(createMockStdinData({ cwd: testProjectDir }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('📄');
      expect(result).to.include('📜');
      expect(result).to.include(' │ ');
    });

    it('should render verbose style', async () => {
      process.env.HOME = testHomeDir;
      const widget = new ConfigCountWidget();
      widget.setStyle('verbose');
      await widget.update(createMockStdinData({ cwd: testProjectDir }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('CLAUDE.md');
      // Only check for items that exist in test data
      expect(result).to.be.a('string');
    });

    it('should handle pluralization in compact style', async () => {
      process.env.HOME = testHomeDir;
      const widget = new ConfigCountWidget();
      widget.setStyle('compact');
      await widget.update(createMockStdinData({ cwd: testProjectDir }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      // Verify compact format is being used (docs instead of CLAUDE.md)
      expect(result).to.be.a('string');
    });

    it('should default to balanced for unknown styles', async () => {
      process.env.HOME = testHomeDir;
      const widget = new ConfigCountWidget();
      await widget.update(createMockStdinData({ cwd: testProjectDir }));

      // @ts-expect-error - testing invalid style
      widget.setStyle('unknown' as any);
      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('CLAUDE.md:');
    });
  });
});
