/**
 * Unit tests for ConfigProvider
 */

import { describe, it, before, after } from 'node:test';
import { expect } from 'chai';
import { rimraf } from 'rimraf';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'node:url';
import { ConfigProvider } from '../../../src/providers/config-provider.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testHomeDir = path.join(__dirname, '../../fixtures/config-home');
const testProjectDir = path.join(__dirname, '../../fixtures/config-project');

describe('ConfigProvider', () => {
  let originalHome: string;

  before(async () => {
    // Store original HOME
    originalHome = process.env.HOME || '';

    // Create test home structure
    await fs.mkdir(path.join(testHomeDir, '.claude', 'rules'), { recursive: true });
    await fs.writeFile(path.join(testHomeDir, '.claude', 'CLAUDE.md'), '# User CLAUDE.md');
    await fs.writeFile(path.join(testHomeDir, '.claude', 'rules', 'rule1.md'), '# Rule 1');
    await fs.writeFile(path.join(testHomeDir, '.claude', 'rules', 'rule2.md'), '# Rule 2');
    await fs.writeFile(
      path.join(testHomeDir, '.claude', 'settings.json'),
      JSON.stringify({
        mcpServers: { mcp1: { command: 'node', args: ['server.js'] } },
        hooks: { 'pre-commit': 'echo "pre-commit"' }
      })
    );

    // Create test project structure
    await fs.mkdir(path.join(testProjectDir, '.claude', 'rules'), { recursive: true });
    await fs.writeFile(path.join(testProjectDir, 'CLAUDE.md'), '# Project CLAUDE.md');
    await fs.writeFile(path.join(testProjectDir, '.claude', 'rules', 'rule3.md'), '# Rule 3');
    await fs.writeFile(
      path.join(testProjectDir, '.claude', 'settings.json'),
      JSON.stringify({
        mcpServers: { mcp2: { command: 'python', args: ['server.py'] } }
      })
    );
  });

  after(async () => {
    // Restore original HOME
    process.env.HOME = originalHome;

    // Cleanup test directories
    await rimraf(testHomeDir);
    await rimraf(testProjectDir);
  });

  it('should count user-scope configs', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs();

    expect(configs.claudeMdCount).to.equal(1);
    expect(configs.rulesCount).to.equal(2);
    expect(configs.mcpCount).to.equal(1);
    expect(configs.hooksCount).to.equal(1);
  });

  it('should count project-scope configs', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ cwd: testProjectDir });

    expect(configs.claudeMdCount).to.equal(2); // 1 user + 1 project
    expect(configs.rulesCount).to.equal(3); // 2 user + 1 project
    expect(configs.mcpCount).to.equal(2); // 1 user + 1 project
  });

  it('should use cache with 5-second interval', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();

    const first = await provider.getConfigs();
    // Add new rule file (should not be counted due to cache)
    await fs.writeFile(path.join(testHomeDir, '.claude', 'rules', 'rule3.md'), '# Rule 3');

    const second = await provider.getConfigs();
    expect(second).to.deep.equal(first); // Cache hit

    // Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 5100));

    const third = await provider.getConfigs();
    expect(third.rulesCount).to.be.greaterThan(first.rulesCount); // Cache miss
  });

  it('should return zeros when no configs exist', async () => {
    process.env.HOME = '/tmp/nonexistent';
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs();

    expect(configs.claudeMdCount).to.equal(0);
    expect(configs.rulesCount).to.equal(0);
    expect(configs.mcpCount).to.equal(0);
    expect(configs.hooksCount).to.equal(0);
  });

  it('should handle missing project directory', async () => {
    process.env.HOME = testHomeDir;
    const provider = new ConfigProvider();
    const configs = await provider.getConfigs({ cwd: '/tmp/nonexistent' });

    // Should still return user-scope configs
    expect(configs.claudeMdCount).to.equal(1);
  });
});
