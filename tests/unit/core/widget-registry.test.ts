import { describe, it } from 'node:test';
import { expect } from 'chai';
import { WidgetRegistry } from '../../../src/core/widget-registry.js';
import { GitWidget } from '../../../src/widgets/git-widget.js';

describe('WidgetRegistry', () => {
  it('should register a widget', async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget({ git: {} as any });

    await registry.register(mockWidget);

    expect(registry.has('git')).to.be.true;
  });

  it('should retrieve a registered widget', async () => {
    const registry = new WidgetRegistry();
    const mockWidget = new GitWidget({ git: {} as any });

    await registry.register(mockWidget);
    const retrieved = registry.get('git');

    expect(retrieved).to.equal(mockWidget);
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

    expect(enabled).to.have.lengthOf(1);
    expect(enabled[0].id).to.equal('git');
  });

  it('should unregister a widget', async () => {
    const registry = new WidgetRegistry();
    const widget = new GitWidget({ git: {} as any });

    await registry.register(widget);
    expect(registry.has('git')).to.be.true;

    await registry.unregister('git');
    expect(registry.has('git')).to.be.false;
  });
});
