import { describe, it } from 'node:test';
import assert from 'node:assert';
import { WidgetRegistry } from '../../../src/core/widget-registry.js';
import { GitWidget } from '../../../src/widgets/git-widget.js';

describe('WidgetRegistry', () => {
  it('should register a widget', async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget({ git: {} as any });

    await registry.register(mockWidget);

    assert.strictEqual(registry.has('git'), true);
  });

  it('should retrieve a registered widget', async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget({ git: {} as any });

    await registry.register(mockWidget);
    const retrieved = registry.get('git');

    assert.strictEqual(retrieved, mockWidget);
  });

  it('should return all enabled widgets', async () => {
    const registry = new WidgetRegistry();
    const widget1 = new GitWidget({ git: {} as any });
    const widget2 = {
      id: 'test',
      metadata: { name: 'Test', description: 'Test', version: '1.0.0', author: 'Test' },
      initialize: async () => {},
      render: async () => 'output',
      update: async () => {},
      isEnabled: () => false,
      cleanup: async () => {}
    };

    await registry.register(widget1);
    await registry.register(widget2 as any);

    const enabled = registry.getEnabledWidgets();

    assert.strictEqual(enabled.length, 1);
    assert.strictEqual(enabled[0].id, 'git');
  });

  it('should unregister a widget', async () => {
    const registry = new WidgetRegistry();
    const widget = new GitWidget({ git: {} as any });

    await registry.register(widget);
    assert.strictEqual(registry.has('git'), true);

    await registry.unregister('git');
    assert.strictEqual(registry.has('git'), false);
  });
});
