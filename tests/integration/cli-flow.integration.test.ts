/**
 * Integration test for complete CLI flow
 * Tests stdin -> parse -> widget -> output
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import { expect } from 'chai';
import { WidgetRegistry } from '#/core/widget-registry.js';
import { Renderer } from '#/core/renderer.js';
import { GitWidget } from '#/widgets/git/git-widget.js';
import { ModelWidget } from '#/widgets/model-widget.js';
import { ContextWidget } from '#/widgets/context-widget.js';
import { CostWidget } from '#/widgets/cost-widget.js';
import { DurationWidget } from '#/widgets/duration-widget.js';
import { GitChangesWidget } from '#/widgets/git/git-changes-widget.js';
import type { StdinData, RenderContext } from '#/types.js';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { simpleGit } from 'simple-git';

function createStdinData(overrides?: Partial<StdinData>): StdinData {
  return {
    hook_event_name: 'Status',
    session_id: 'session_20250105_123045',
    transcript_path: '/tmp/transcript.json',
    cwd: process.cwd(),
    model: { id: 'claude-opus-4-5-20251101', display_name: 'Claude Opus 4.5' },
    workspace: {
      current_dir: process.cwd(),
      project_dir: process.cwd()
    },
    version: '1.0.80',
    output_style: { name: 'default' },
    cost: {
      total_cost_usd: 0.0123,
      total_duration_ms: 330000,
      total_api_duration_ms: 15000,
      total_lines_added: 42,
      total_lines_removed: 10
    },
    context_window: {
      total_input_tokens: 15234,
      total_output_tokens: 4521,
      context_window_size: 200000,
      current_usage: {
        input_tokens: 8500,
        output_tokens: 1200,
        cache_creation_input_tokens: 5000,
        cache_read_input_tokens: 2000
      }
    },
    ...overrides
  };
}

describe('CLI Flow Integration', () => {
  let registry: WidgetRegistry;
  let renderer: Renderer;
  let testDir: string;

  beforeEach(async () => {
    registry = new WidgetRegistry();
    renderer = new Renderer();
    // Create temporary directory for git tests
    testDir = await mkdtemp(join(process.cwd(), 'test-git-'));
  });

  afterEach(async () => {
    await registry.clear();
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Complete flow with valid stdin data', () => {
    it('should process stdin data and render widgets', async () => {
      // Arrange: Create widgets
      const modelWidget = new ModelWidget();
      const contextWidget = new ContextWidget();
      const costWidget = new CostWidget();
      const durationWidget = new DurationWidget();

      // Register widgets
      await registry.register(modelWidget);
      await registry.register(contextWidget);
      await registry.register(costWidget);
      await registry.register(durationWidget);

      // Act: Simulate stdin data flow
      const stdinData = createStdinData();

      // Update all widgets with stdin data
      for (const widget of registry.getAll()) {
        await widget.update(stdinData);
      }

      // Render output
      const renderContext: RenderContext = {
        width: 80,
        timestamp: Date.now()
      };

      const output = await renderer.render(
        registry.getEnabledWidgets(),
        renderContext
      );

      // Assert: Output contains widget data
      expect(output).to.be.a('string');
      expect(output).to.include('Claude Opus 4.5');
      expect(output).to.include('$0.01');
    });

    it('should filter out disabled widgets', async () => {
      // Arrange: Create widget but disable it
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget);
      await modelWidget.initialize({ config: { enabled: false } });

      // Act: Update widget
      const stdinData = createStdinData();
      await modelWidget.update(stdinData);

      // Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: No output (widget disabled)
      expect(output).to.equal('');
    });
  });

  describe('Integration between components', () => {
    it('should initialize widget through registry', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();

      // Act: Register widget with initialization context
      await registry.register(modelWidget, {
        config: { enabled: true, customOption: 'value' }
      });

      // Assert: Widget is registered and enabled
      expect(registry.has('model')).to.be.true;
      expect(modelWidget.isEnabled()).to.be.true;
      expect(registry.getEnabledWidgets()).to.have.length(1);
    });

    it('should update widget state with new stdin data', async () => {
      // Arrange: Create and register widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Update with initial data
      const stdinData1 = createStdinData({
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
      });
      await modelWidget.update(stdinData1);

      // Update with new data
      const stdinData2 = createStdinData({
        model: { id: 'claude-sonnet-4-5', display_name: 'Sonnet 4.5' }
      });
      await modelWidget.update(stdinData2);

      // Assert: Widget processes both updates
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await modelWidget.render(renderContext);

      expect(output).to.include('Sonnet 4.5');
    });

    it('should cleanup widget when unregistered', async () => {
      // Arrange: Create and register widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Unregister widget
      await registry.unregister('model');

      // Assert: Widget removed from registry
      expect(registry.has('model')).to.be.false;
      expect(registry.getAll()).to.have.length(0);
    });
  });

  describe('Output format verification', () => {
    it('should render output with default separator', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Update and render output
      const stdinData = createStdinData({
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
      });
      await modelWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Output contains model name
      expect(output).to.include('Opus 4.5');
      expect(output).to.be.a('string');
    });

    it('should render output with custom separator', async () => {
      // Arrange: Create renderer with custom separator
      const customRenderer = new Renderer();
      customRenderer.setSeparator(' | ');

      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Render with custom separator
      const stdinData = createStdinData({
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
      });
      await modelWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await customRenderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Output contains model
      expect(output).to.include('Opus 4.5');
    });

    it('should handle null widget output', async () => {
      // Arrange: Create cost widget with no cost data
      const costWidget = new CostWidget();
      await registry.register(costWidget, { config: { enabled: true } });

      // Act: Render with no cost data
      const stdinData = createStdinData({ cost: undefined as any });
      await costWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const widgetOutput = await costWidget.render(renderContext);
      expect(widgetOutput).to.be.null;

      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Empty output when widget returns null
      expect(output).to.equal('');
    });
  });

  describe('Error handling for invalid input', () => {
    it('should handle missing cwd in stdin data', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Update with empty cwd
      const stdinData = createStdinData({ cwd: '' });

      // Should not throw
      await modelWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await modelWidget.render(renderContext);

      // Assert: Handles gracefully
      expect(output).to.not.be.undefined;
    });

    it('should handle duplicate widget registration', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();

      // Act: Try to register same widget twice
      await registry.register(modelWidget, { config: { enabled: true } });

      // Assert: Second registration throws
      try {
        await registry.register(modelWidget, { config: { enabled: true } });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('already registered');
      }
    });

    it('should handle unregistering non-existent widget', async () => {
      // Act: Try to unregister widget that doesn't exist
      // Should not throw
      await registry.unregister('non-existent');

      // Assert: Registry remains empty
      expect(registry.getAll()).to.have.length(0);
    });
  });

  describe('End-to-end scenarios', () => {
    it('should complete full workflow: register -> update -> render -> cleanup', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();

      // Step 1: Register widget
      await registry.register(modelWidget, { config: { enabled: true } });
      expect(registry.has('model')).to.be.true;

      // Step 2: Update with stdin data
      const stdinData = createStdinData({
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
      });
      await modelWidget.update(stdinData);

      // Step 3: Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);
      expect(output).to.include('Opus 4.5');

      // Step 4: Cleanup
      await registry.unregister('model');
      expect(registry.has('model')).to.be.false;
    });

    it('should handle rapid stdin data updates', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      // Act: Simulate rapid updates
      const updates = [
        createStdinData({ session_id: 'session_001' }),
        createStdinData({ session_id: 'session_002' }),
        createStdinData({ session_id: 'session_003' })
      ];

      for (const data of updates) {
        await modelWidget.update(data);
      }

      // Assert: Widget handles all updates
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await modelWidget.render(renderContext);
      expect(output).to.include('Claude Opus 4.5');
    });

    it('should handle multiple render cycles', async () => {
      // Arrange: Create widget
      const modelWidget = new ModelWidget();
      await registry.register(modelWidget, { config: { enabled: true } });

      const stdinData = createStdinData({
        model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
      });
      await modelWidget.update(stdinData);

      // Act: Render multiple times
      const outputs: string[] = [];
      for (let i = 0; i < 3; i++) {
        const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
        const output = await renderer.render(registry.getEnabledWidgets(), renderContext);
        outputs.push(output);
      }

      // Assert: All renders succeed
      outputs.forEach(output => {
        expect(output).to.include('Opus 4.5');
      });
    });
  });

  describe('Git widget integration', () => {
    it('should work with real git repository', async () => {
      // Arrange: Initialize git repo in temp directory
      await simpleGit(testDir).init();
      await simpleGit(testDir).addConfig('user.name', 'Test User');
      await simpleGit(testDir).addConfig('user.email', 'test@example.com');

      // Create a commit to have a branch
      const testFile = join(testDir, 'test.txt');
      await writeFile(testFile, 'test content');
      await simpleGit(testDir).add(testFile);
      await simpleGit(testDir).commit('Initial commit');
      await simpleGit(testDir).checkout(['-b', 'feature-test']);

      // Create GitWidget
      const gitWidget = new GitWidget();
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Update with temp directory as cwd
      const stdinData = createStdinData({ cwd: testDir });
      await gitWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await gitWidget.render(renderContext);

      // Assert: Output contains branch name
      expect(output).to.be.a('string');
      expect(output).to.include('feature-test');

      // Cleanup
      await registry.unregister('git');
    });
  });
});
