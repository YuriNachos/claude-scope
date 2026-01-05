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
import { createMockGit, createMockStdinData } from '../fixtures/mock-data.js';

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

    const mockData = createMockStdinData({
      model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' },
      cost: {
        total_cost_usd: 0.0123,
        total_duration_ms: 330000,
        total_api_duration_ms: 15000,
        total_lines_added: 42,
        total_lines_removed: 10
      }
    });
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

    const mockData = createMockStdinData({
      model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
    });
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

    const mockData = createMockStdinData({
      model: { id: 'claude-opus-4-5', display_name: 'Opus 4.5' }
    });
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
