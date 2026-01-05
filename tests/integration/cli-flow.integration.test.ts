/**
 * Integration test for complete CLI flow
 * Tests stdin -> parse -> git provider -> widget -> output
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import { expect } from 'chai';
import { WidgetRegistry } from '../../src/core/widget-registry.js';
import { Renderer } from '../../src/core/renderer.js';
import { GitWidget } from '../../src/widgets/git-widget.js';
import type { StdinData, RenderContext } from '../../src/core/types.js';

/**
 * Mock git implementation for testing
 */
class MockGit implements {
  checkIsRepo(): Promise<boolean>;
  branch(): Promise<{ current: string | null; all: string[] }>;
} {
  private isRepoValue: boolean;
  private currentBranch: string | null;

  constructor(options: { isRepo: boolean; branch: string | null }) {
    this.isRepoValue = options.isRepo;
    this.currentBranch = options.branch;
  }

  async checkIsRepo(): Promise<boolean> {
    return this.isRepoValue;
  }

  async branch(): Promise<{ current: string | null; all: string[] }> {
    return {
      current: this.currentBranch,
      all: this.currentBranch ? [this.currentBranch, 'main', 'develop'] : []
    };
  }
}

describe('CLI Flow Integration', () => {
  let registry: WidgetRegistry;
  let renderer: Renderer;
  let mockGit: MockGit;

  beforeEach(() => {
    registry = new WidgetRegistry();
    renderer = new Renderer();
    mockGit = new MockGit({ isRepo: true, branch: 'feature-test' });
  });

  afterEach(async () => {
    await registry.clear();
  });

  describe('Complete flow with valid stdin data', () => {
    it('should process stdin data and render git branch', async () => {
      // Arrange: Create widget with mock git
      const gitWidget = new GitWidget({ git: mockGit });

      // Register widget with config
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Simulate stdin data flow
      const stdinData: StdinData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: {
          id: 'claude-opus-4-5-20251101',
          display_name: 'Claude Opus 4.5'
        }
      };

      // Update widget with stdin data
      await gitWidget.update(stdinData);

      // Render output
      const renderContext: RenderContext = {
        width: 80,
        timestamp: Date.now()
      };

      const output = await renderer.render(
        registry.getEnabledWidgets(),
        renderContext
      );

      // Assert: Output contains the branch name
      expect(output).to.be.a('string');
      expect(output).to.include('feature-test');
      expect(output).to.match(/^\s*feature-test$/);
    });

    it('should handle single widget with registry lifecycle', async () => {
      // Arrange: Create git widget
      const gitWidget = new GitWidget({ git: mockGit });

      // Register widget
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Update widget with stdin data
      const stdinData: StdinData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: { id: 'claude-opus-4-5-20251101', display_name: 'Claude Opus 4.5' }
      };

      await gitWidget.update(stdinData);

      // Verify widget is in registry
      expect(registry.get('git')).to.equal(gitWidget);

      // Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Output contains branch name
      expect(output).to.include('feature-test');
    });

    it('should filter out disabled widgets', async () => {
      // Arrange: Create widget but disable it
      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: false } });

      // Act: Update widget
      const stdinData: StdinData = {
        session_id: 'session_20250105_123045',
        cwd: '/Users/user/project',
        model: { id: 'claude-opus-4-5-20251101', display_name: 'Claude Opus 4.5' }
      };

      await gitWidget.update(stdinData);

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
      const gitWidget = new GitWidget({ git: mockGit });

      // Act: Register widget with initialization context
      await registry.register(gitWidget, {
        config: { enabled: true, customOption: 'value' }
      });

      // Assert: Widget is registered and enabled
      expect(registry.has('git')).to.be.true;
      expect(gitWidget.isEnabled()).to.be.true;
      expect(registry.getEnabledWidgets()).to.have.length(1);
    });

    it('should update widget state with new stdin data', async () => {
      // Arrange: Create and register widget
      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Update with initial data
      const stdinData1: StdinData = {
        session_id: 'session_1',
        cwd: '/path/to/repo',
        model: { id: 'model-1', display_name: 'Model 1' }
      };

      await gitWidget.update(stdinData1);

      // Update with new data
      const stdinData2: StdinData = {
        session_id: 'session_2',
        cwd: '/path/to/repo',
        model: { id: 'model-2', display_name: 'Model 2' }
      };

      await gitWidget.update(stdinData2);

      // Assert: Widget processes both updates
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await gitWidget.render(renderContext);

      expect(output).to.include('feature-test');
    });

    it('should cleanup widget when unregistered', async () => {
      // Arrange: Create and register widget
      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Unregister widget
      await registry.unregister('git');

      // Assert: Widget removed from registry
      expect(registry.has('git')).to.be.false;
      expect(registry.getAll()).to.have.length(0);
    });
  });

  describe('Output format verification', () => {
    it('should render output with default separator', async () => {
      // Arrange: Create widget
      const gitWidget = new GitWidget({ git: mockGit });

      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Update and render output
      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '/path',
        model: { id: 'model', display_name: 'Model' }
      };

      await gitWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Output contains branch name with proper formatting
      expect(output).to.include('feature-test');
      expect(output).to.be.a('string');
    });

    it('should render output with custom separator', async () => {
      // Arrange: Create renderer with custom separator
      const customRenderer = new Renderer();
      customRenderer.setSeparator(' | ');

      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Render with custom separator
      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '/path',
        model: { id: 'model', display_name: 'Model' }
      };

      await gitWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await customRenderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Output contains branch
      expect(output).to.include('feature-test');
    });

    it('should handle null widget output', async () => {
      // Arrange: Create mock git that returns null branch
      const nullMockGit = new MockGit({ isRepo: true, branch: null });
      const gitWidget = new GitWidget({ git: nullMockGit });

      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Render output
      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '/path',
        model: { id: 'model', display_name: 'Model' }
      };

      await gitWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);

      // Assert: Empty output when widget returns null
      expect(output).to.equal('');
    });
  });

  describe('Error handling for invalid input', () => {
    it('should handle non-git repository gracefully', async () => {
      // Arrange: Create mock git that reports not a repo
      const nonRepoGit = new MockGit({ isRepo: false, branch: null });
      const gitWidget = new GitWidget({ git: nonRepoGit });

      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Update and render
      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '/not/a/repo',
        model: { id: 'model', display_name: 'Model' }
      };

      await gitWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await gitWidget.render(renderContext);

      // Assert: No output for non-repo
      expect(output).to.be.null;
    });

    it('should handle missing cwd in stdin data', async () => {
      // Arrange: Create widget
      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Update with empty cwd
      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '',
        model: { id: 'model', display_name: 'Model' }
      };

      // Should not throw
      await gitWidget.update(stdinData);

      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await gitWidget.render(renderContext);

      // Assert: Handles gracefully
      expect(output).to.not.be.undefined;
    });

    it('should handle duplicate widget registration', async () => {
      // Arrange: Create widget
      const gitWidget = new GitWidget({ git: mockGit });

      // Act: Try to register same widget twice
      await registry.register(gitWidget, { config: { enabled: true } });

      // Assert: Second registration throws
      try {
        await registry.register(gitWidget, { config: { enabled: true } });
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
      const gitWidget = new GitWidget({ git: mockGit });

      // Step 1: Register widget
      await registry.register(gitWidget, { config: { enabled: true } });
      expect(registry.has('git')).to.be.true;

      // Step 2: Update with stdin data
      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '/project',
        model: { id: 'model', display_name: 'Model' }
      };

      await gitWidget.update(stdinData);

      // Step 3: Render output
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await renderer.render(registry.getEnabledWidgets(), renderContext);
      expect(output).to.include('feature-test');

      // Step 4: Cleanup
      await registry.unregister('git');
      expect(registry.has('git')).to.be.false;
    });

    it('should handle rapid stdin data updates', async () => {
      // Arrange: Create widget
      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: true } });

      // Act: Simulate rapid updates
      const updates = [
        { session_id: 's1', cwd: '/path', model: { id: 'm1', display_name: 'M1' } },
        { session_id: 's2', cwd: '/path', model: { id: 'm2', display_name: 'M2' } },
        { session_id: 's3', cwd: '/path', model: { id: 'm3', display_name: 'M3' } }
      ];

      for (const data of updates) {
        await gitWidget.update(data);
      }

      // Assert: Widget handles all updates
      const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
      const output = await gitWidget.render(renderContext);
      expect(output).to.include('feature-test');
    });

    it('should handle multiple render cycles', async () => {
      // Arrange: Create widget
      const gitWidget = new GitWidget({ git: mockGit });
      await registry.register(gitWidget, { config: { enabled: true } });

      const stdinData: StdinData = {
        session_id: 'session',
        cwd: '/project',
        model: { id: 'model', display_name: 'Model' }
      };

      await gitWidget.update(stdinData);

      // Act: Render multiple times
      const outputs: string[] = [];
      for (let i = 0; i < 3; i++) {
        const renderContext: RenderContext = { width: 80, timestamp: Date.now() };
        const output = await renderer.render(registry.getEnabledWidgets(), renderContext);
        outputs.push(output);
      }

      // Assert: All renders succeed
      outputs.forEach(output => {
        expect(output).to.include('feature-test');
      });
    });
  });
});
