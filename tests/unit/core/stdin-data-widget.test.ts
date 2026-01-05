/**
 * Unit tests for StdinDataWidget base class
 */

import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import { StdinDataWidget } from '../../../src/core/stdin-data-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';
import type { IWidgetMetadata, WidgetContext, RenderContext } from '../../../src/core/types.js';

// Test implementation of abstract class
class TestWidget extends StdinDataWidget {
  readonly id = 'test-widget';
  readonly metadata: IWidgetMetadata = {
    name: 'Test Widget',
    description: 'A test widget',
    version: '1.0.0',
    author: 'test'
  };

  renderReturnValue: string | null = 'test output';

  async render(context: RenderContext): Promise<string | null> {
    return this.renderReturnValue;
  }
}

describe('StdinDataWidget', () => {
  describe('initialization', () => {
    it('should set enabled to true by default', async () => {
      const widget = new TestWidget();
      const context: WidgetContext = { config: {} };

      await widget.initialize(context);

      expect(widget.isEnabled()).to.be.true;
    });

    it('should respect enabled config when set to false', async () => {
      const widget = new TestWidget();
      const context: WidgetContext = { config: { enabled: false } };

      await widget.initialize(context);

      expect(widget.isEnabled()).to.be.false;
    });

    it('should respect enabled config when set to true', async () => {
      const widget = new TestWidget();
      const context: WidgetContext = { config: { enabled: true } };

      await widget.initialize(context);

      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe('update', () => {
    it('should store StdinData', async () => {
      const widget = new TestWidget();
      const mockData = createMockStdinData();

      await widget.update(mockData);

      // Verify data is stored by checking getData() doesn't throw
      expect(() => widget.getData()).to.not.throw();
    });

    it('should allow multiple updates', async () => {
      const widget = new TestWidget();
      const data1 = createMockStdinData({ session_id: 'session-1' });
      const data2 = createMockStdinData({ session_id: 'session-2' });

      await widget.update(data1);
      expect(widget.getData().session_id).to.equal('session-1');

      await widget.update(data2);
      expect(widget.getData().session_id).to.equal('session-2');
    });
  });

  describe('getData', () => {
    it('should return stored StdinData', async () => {
      const widget = new TestWidget();
      const mockData = createMockStdinData();

      await widget.update(mockData);
      const retrieved = widget.getData();

      expect(retrieved).to.equal(mockData);
      expect(retrieved.session_id).to.equal('test-session');
    });

    it('should throw error when data not initialized', () => {
      const widget = new TestWidget();

      expect(() => widget.getData()).to.throw(
        /Widget test-widget data not initialized/
      );
    });

    it('should include widget id in error message', () => {
      const widget = new TestWidget();

      try {
        widget.getData();
        throw new Error('Expected getData() to throw');
      } catch (error) {
        expect((error as Error).message).to.include('test-widget');
      }
    });

    it('should throw before first update', async () => {
      const widget = new TestWidget();
      await widget.initialize({ config: {} });

      expect(() => widget.getData()).to.throw();
    });
  });

  describe('render', () => {
    it('should call render implementation', async () => {
      const widget = new TestWidget();
      widget.renderReturnValue = 'custom output';
      const context: RenderContext = { width: 80, timestamp: 0 };

      const result = await widget.render(context);

      expect(result).to.equal('custom output');
    });

    it('should allow null return value', async () => {
      const widget = new TestWidget();
      widget.renderReturnValue = null;
      const context: RenderContext = { width: 80, timestamp: 0 };

      const result = await widget.render(context);

      expect(result).to.be.null;
    });

    it('should provide context to render', async () => {
      const widget = new TestWidget();
      const context: RenderContext = { width: 100, timestamp: 12345 };

      // Store data first
      await widget.update(createMockStdinData());

      // Render should work with context
      const result = await widget.render(context);

      expect(result).to.equal('test output');
    });
  });

  describe('isEnabled', () => {
    it('should return false when disabled via config', async () => {
      const widget = new TestWidget();
      await widget.initialize({ config: { enabled: false } });

      expect(widget.isEnabled()).to.be.false;
    });

    it('should return true when enabled via config', async () => {
      const widget = new TestWidget();
      await widget.initialize({ config: { enabled: true } });

      expect(widget.isEnabled()).to.be.true;
    });

    it('should return true when no config provided', async () => {
      const widget = new TestWidget();
      await widget.initialize({ config: {} });

      expect(widget.isEnabled()).to.be.true;
    });
  });

  describe('widget contract', () => {
    it('should have required id property', () => {
      const widget = new TestWidget();

      expect(widget.id).to.equal('test-widget');
      expect(typeof widget.id).to.equal('string');
    });

    it('should have required metadata property', () => {
      const widget = new TestWidget();

      expect(widget.metadata).to.be.an('object');
      expect(widget.metadata.name).to.equal('Test Widget');
      expect(widget.metadata.description).to.equal('A test widget');
      expect(widget.metadata.version).to.equal('1.0.0');
      expect(widget.metadata.author).to.equal('test');
    });

    it('should implement initialize method', async () => {
      const widget = new TestWidget();

      expect(typeof widget.initialize).to.equal('function');
      // Should not throw
      await widget.initialize({ config: {} });
    });

    it('should implement update method', async () => {
      const widget = new TestWidget();

      expect(typeof widget.update).to.equal('function');
      // Should not throw
      await widget.update(createMockStdinData());
    });

    it('should implement isEnabled method', () => {
      const widget = new TestWidget();

      expect(typeof widget.isEnabled).to.equal('function');
    });

    it('should implement render method', async () => {
      const widget = new TestWidget();
      const context: RenderContext = { width: 80, timestamp: 0 };

      expect(typeof widget.render).to.equal('function');
      // Should not throw
      await widget.render(context);
    });
  });

  describe('cleanup', () => {
    it('should have optional cleanup method', async () => {
      const widget = new TestWidget();

      // cleanup is optional, so it may not exist
      if (widget.cleanup) {
        expect(typeof widget.cleanup).to.equal('function');
        await expect(widget.cleanup()).to.be.fulfilled;
      }
      // If cleanup doesn't exist, that's also fine
    });
  });

  describe('data persistence', () => {
    it('should preserve data across render calls', async () => {
      const widget = new TestWidget();
      const mockData = createMockStdinData({ session_id: 'persistent-session' });
      const context: RenderContext = { width: 80, timestamp: 0 };

      await widget.update(mockData);

      // Multiple renders should use same data
      await widget.render(context);
      expect(widget.getData().session_id).to.equal('persistent-session');

      await widget.render(context);
      expect(widget.getData().session_id).to.equal('persistent-session');
    });

    it('should update data on subsequent update calls', async () => {
      const widget = new TestWidget();
      const data1 = createMockStdinData({ session_id: 'first' });
      const data2 = createMockStdinData({ session_id: 'second' });

      await widget.update(data1);
      expect(widget.getData().session_id).to.equal('first');

      await widget.update(data2);
      expect(widget.getData().session_id).to.equal('second');
    });
  });

  describe('edge cases', () => {
    it('should handle empty config object', async () => {
      const widget = new TestWidget();

      await widget.initialize({});

      expect(widget.isEnabled()).to.be.true;
    });

    it('should handle undefined config value', async () => {
      const widget = new TestWidget();

      await widget.initialize({ config: undefined });

      expect(widget.isEnabled()).to.be.true;
    });

    it('should handle render before update', async () => {
      const widget = new TestWidget();
      const context: RenderContext = { width: 80, timestamp: 0 };

      // Render before update should work (implementation dependent)
      // In this case, getData() will throw, but render might not call getData()
      const result = await widget.render(context);

      expect(result).to.equal('test output');
    });

    it('should handle rapid update calls', async () => {
      const widget = new TestWidget();
      const updates = Array.from({ length: 100 }, (_, i) =>
        createMockStdinData({ session_id: `session-${i}` })
      );

      // All updates should complete
      for (const data of updates) {
        await widget.update(data);
      }

      // Last data should persist
      expect(widget.getData().session_id).to.equal('session-99');
    });
  });
});
