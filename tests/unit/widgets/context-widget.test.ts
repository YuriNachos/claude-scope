/**
 * Unit tests for ContextWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { ContextWidget } from '../../../src/widgets/context-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';
import type { ContextUsage } from '../../../src/types.js';
import { matchSnapshot, stripAnsi } from '../../helpers/snapshot.js';

describe('ContextWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new ContextWidget();
    expect(widget.id).to.equal('context');
    expect(widget.metadata.name).to.equal('Context');
  });

  it('should return null when current_usage is null', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: null as unknown as ContextUsage
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });

  it('should calculate usage with cache tokens', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 100000,
        current_usage: {
          input_tokens: 30000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 15000
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Calculation: (30000 + 10000 + 5000 + 15000) / 100000 = 60%
    // cache_read_input_tokens (15000) IS counted - they occupy context space
    expect(result).to.include('60%');
    expect(result).to.include('[');
    expect(result).to.include(']');
  });

  it('should use green color for low usage (< 50%)', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 40000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[32m'); // Green ANSI code
  });

  it('should use yellow color for medium usage (50-79%)', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 100000,
        current_usage: {
          input_tokens: 60000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[33m'); // Yellow ANSI code
  });

  it('should use red color for high usage (>= 80%)', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 100000,
        current_usage: {
          input_tokens: 75000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[31m'); // Red ANSI code
  });

  it('should handle 0% usage', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 0,
        total_output_tokens: 0,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 0,
          output_tokens: 0,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('0%');
  });

  it('should handle 100% usage', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 200000,
        total_output_tokens: 0,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 200000,
          output_tokens: 0,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('100%');
  });

  describe('snapshots', () => {
    it('should snapshot low usage output (green)', async () => {
      const widget = new ContextWidget();
      await widget.update(createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 200000,
          current_usage: {
            input_tokens: 40000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 0
          }
        }
      }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot('context-widget-low-usage', stripAnsi(result || ''));
    });

    it('should snapshot medium usage output (yellow)', async () => {
      const widget = new ContextWidget();
      await widget.update(createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 100000,
          current_usage: {
            input_tokens: 60000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 0
          }
        }
      }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot('context-widget-medium-usage', stripAnsi(result || ''));
    });

    it('should snapshot high usage output (red)', async () => {
      const widget = new ContextWidget();
      await widget.update(createMockStdinData({
        context_window: {
          total_input_tokens: 1000,
          total_output_tokens: 500,
          context_window_size: 100000,
          current_usage: {
            input_tokens: 75000,
            output_tokens: 10000,
            cache_creation_input_tokens: 5000,
            cache_read_input_tokens: 0
          }
        }
      }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      await matchSnapshot('context-widget-high-usage', stripAnsi(result || ''));
    });
  });
});
