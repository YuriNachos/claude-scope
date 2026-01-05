/**
 * Integration tests for 5 core widgets
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { WidgetRegistry } from '../../src/core/widget-registry.js';
import { Renderer } from '../../src/core/renderer.js';
import { ModelWidget } from '../../src/widgets/model-widget.js';
import { ContextWidget } from '../../src/widgets/context-widget.js';
import { CostWidget } from '../../src/widgets/cost-widget.js';
import { DurationWidget } from '../../src/widgets/duration-widget.js';
import { GitChangesWidget } from '../../src/widgets/git-changes-widget.js';
import type { IGit } from '../../src/providers/git-provider.js';
import type { StdinData } from '../../src/types.js';

// Mock git provider
function createMockGit(overrides: Partial<IGit> = {}): IGit {
  return {
    checkIsRepo: async () => true,
    branch: async () => ({ current: 'main', all: ['main', 'develop'] }),
    diffStats: async () => ({ insertions: 42, deletions: 10 }),
    ...overrides
  };
}

// Helper to create mock StdinData
function createMockStdinData(overrides: Partial<StdinData> = {}): StdinData {
  return {
    hook_event_name: 'Status',
    session_id: 'test-session',
    transcript_path: '/test/transcript.json',
    cwd: '/test/project',
    model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
    workspace: { current_dir: '/test/project', project_dir: '/test/project' },
    version: '1.0.0',
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

describe('Five Widgets Integration', () => {
  it('should render all widgets in single line with pipe separator', async () => {
    const registry = new WidgetRegistry();
    const mockGit = createMockGit();

    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new DurationWidget());
    await registry.register(new GitChangesWidget(mockGit));

    const renderer = new Renderer();
    renderer.setSeparator(' │ ');

    const mockData = createMockStdinData();
    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    const output = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );

    expect(output).to.be.a('string');
    expect(output).to.include('Opus 4.5');
    expect(output).to.include('[');
    expect(output).to.include(']');
    expect(output).to.include('$0.01');
    expect(output).to.include('5m 30s');
    expect(output).to.include('+42,-10');
    expect(output).to.include(' │ ');
  });

  it('should skip widgets that return null', async () => {
    const registry = new WidgetRegistry();
    const mockGit = createMockGit({
      diffStats: async () => null // No git changes
    });

    await registry.register(new ModelWidget());
    await registry.register(new GitChangesWidget(mockGit));

    const renderer = new Renderer();
    renderer.setSeparator(' │ ');

    const mockData = createMockStdinData();
    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    const output = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );

    expect(output).to.include('Opus 4.5');
    expect(output).to.not.include('+'); // No git changes
  });

  it('should handle all widgets enabled by default', async () => {
    const registry = new WidgetRegistry();
    const mockGit = createMockGit();

    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new DurationWidget());
    await registry.register(new GitChangesWidget(mockGit));

    const enabledWidgets = registry.getEnabledWidgets();

    expect(enabledWidgets).to.have.lengthOf(5);
  });

  it('should respect widget disabled config', async () => {
    const registry = new WidgetRegistry();

    const costWidget = new CostWidget();
    await registry.register(costWidget);
    await costWidget.initialize({ config: { enabled: false } });

    const enabledWidgets = registry.getEnabledWidgets();

    expect(enabledWidgets).to.have.lengthOf(0);
  });

  it('should render in correct widget order', async () => {
    const registry = new WidgetRegistry();
    const mockGit = createMockGit();

    // Register in specific order
    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());

    const renderer = new Renderer();
    renderer.setSeparator(' │ ');

    const mockData = createMockStdinData();
    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    const output = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );

    // Check order by finding positions
    const modelPos = output.indexOf('Opus 4.5');
    const contextPos = output.indexOf('[');
    const costPos = output.indexOf('$0.01');

    expect(modelPos).to.be.lessThan(contextPos);
    expect(contextPos).to.be.lessThan(costPos);
  });

  it('should handle updates to all widgets', async () => {
    const registry = new WidgetRegistry();
    const mockGit = createMockGit();

    await registry.register(new ModelWidget());
    await registry.register(new CostWidget());

    const renderer = new Renderer();
    renderer.setSeparator(' │ ');

    // First update
    let mockData = createMockStdinData({
      model: { id: 'model-1', display_name: 'Model 1' },
      cost: { total_cost_usd: 1.0, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 }
    });

    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    let output = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );

    expect(output).to.include('Model 1');
    expect(output).to.include('$1.00');

    // Second update
    mockData = createMockStdinData({
      model: { id: 'model-2', display_name: 'Model 2' },
      cost: { total_cost_usd: 2.5, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 }
    });

    for (const widget of registry.getAll()) {
      await widget.update(mockData);
    }

    output = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );

    expect(output).to.include('Model 2');
    expect(output).to.include('$2.50');
  });
});
