import { describe, it } from 'node:test';
import assert from 'node:assert';
import { IWidget, IWidgetMetadata, WidgetContext } from '../../../src/core/types.js';

describe('IWidget', () => {
  it('should define required interface methods', () => {
    // This is a type-level test - ensures interface exists and is correct
    const widgetMock: IWidget = {
      id: 'test-widget',
      metadata: {
        name: 'Test Widget',
        description: 'A test widget',
        version: '1.0.0',
        author: 'Test'
      },
      initialize: async () => {},
      render: async () => 'test output',
      update: async () => {},
      isEnabled: () => true
    };

    assert.strictEqual(widgetMock.id, 'test-widget');
    assert.strictEqual(widgetMock.metadata.name, 'Test Widget');
    assert.strictEqual(typeof widgetMock.initialize, 'function');
    assert.strictEqual(typeof widgetMock.render, 'function');
    assert.strictEqual(typeof widgetMock.update, 'function');
    assert.strictEqual(typeof widgetMock.isEnabled, 'function');
  });

  it('should allow optional cleanup method', () => {
    const widgetWithCleanup: IWidget = {
      id: 'test-widget',
      metadata: {
        name: 'Test Widget',
        description: 'A test widget',
        version: '1.0.0',
        author: 'Test'
      },
      initialize: async () => {},
      render: async () => null,
      update: async () => {},
      isEnabled: () => false,
      cleanup: async () => {}
    };

    assert.strictEqual(typeof widgetWithCleanup.cleanup, 'function');
  });
});
