import { describe, it } from 'node:test';
import { expect } from 'chai';
import { Renderer } from '../../../src/core/renderer.js';

describe('Renderer', () => {
  it('should render single widget output', async () => {
    const renderer = new Renderer();
    const mockWidget = {
      id: 'test',
      metadata: { name: 'Test', description: 'Test', version: '1.0.0', author: 'Test' },
      initialize: async () => {},
      render: async () => 'test output',
      update: async () => {},
      isEnabled: () => true
    };

    const result = await renderer.render([mockWidget as any], { width: 80, timestamp: Date.now() });

    expect(result).to.include('test output');
  });

  it('should render multiple widgets on one line', async () => {
    const renderer = new Renderer();
    const widget1 = {
      id: 'test1',
      metadata: { name: 'Test1', description: 'Test', version: '1.0.0', author: 'Test' },
      initialize: async () => {},
      render: async () => 'output1',
      update: async () => {},
      isEnabled: () => true
    };
    const widget2 = {
      id: 'test2',
      metadata: { name: 'Test2', description: 'Test', version: '1.0.0', author: 'Test' },
      initialize: async () => {},
      render: async () => 'output2',
      update: async () => {},
      isEnabled: () => true
    };

    const result = await renderer.render([widget1 as any, widget2 as any], { width: 80, timestamp: Date.now() });

    expect(result).to.include('output1');
    expect(result).to.include('output2');
  });

  it('should skip disabled widgets', async () => {
    const renderer = new Renderer();
    const disabledWidget = {
      id: 'disabled',
      metadata: { name: 'Disabled', description: 'Test', version: '1.0.0', author: 'Test' },
      initialize: async () => {},
      render: async () => 'should not see',
      update: async () => {},
      isEnabled: () => false
    };

    const result = await renderer.render([disabledWidget as any], { width: 80, timestamp: Date.now() });

    expect(result).to.not.include('should not see');
  });

  it('should skip widgets that return null', async () => {
    const renderer = new Renderer();
    const nullWidget = {
      id: 'null',
      metadata: { name: 'Null', description: 'Test', version: '1.0.0', author: 'Test' },
      initialize: async () => {},
      render: async () => null,
      update: async () => {},
      isEnabled: () => true
    };

    const result = await renderer.render([nullWidget as any], { width: 80, timestamp: Date.now() });

    expect(result).to.equal('');
  });
});
