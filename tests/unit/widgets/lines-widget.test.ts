/**
 * Unit tests for LinesWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { LinesWidget } from '../../../src/widgets/lines-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

describe('LinesWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new LinesWidget();
    expect(widget.id).to.equal('lines');
    expect(widget.metadata.name).to.equal('Lines');
  });

  it('should display lines with colors when data exists', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 123,
        total_lines_removed: 45
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    // Should contain the numbers (colors are ANSI codes)
    expect(result).to.include('+123');
    expect(result).to.include('-45');
    expect(result).to.include('/');
  });

  it('should show zeros when cost data is missing', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({ cost: undefined }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-0');
    expect(result).to.include('/');
  });

  it('should show zeros when cost exists but lines are undefined', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-0');
  });

  it('should handle large numbers without abbreviation', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 1234567,
        total_lines_removed: 987654
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+1234567');
    expect(result).to.include('-987654');
  });

  it('should handle zero values', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-0');
  });

  it('should handle only additions (no deletions)', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 100,
        total_lines_removed: 0
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+100');
    expect(result).to.include('-0');
  });

  it('should handle only deletions (no additions)', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 50
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-50');
  });

  describe('with custom colors', () => {
    it('should use custom colors when provided', async () => {
      const customColors = { added: '\x1b[36m', removed: '\x1b[35m' };
      const widget = new LinesWidget(customColors);
      await widget.update(createMockStdinData({
        cost: {
          total_cost_usd: 0.01,
          total_duration_ms: 0,
          total_api_duration_ms: 0,
          total_lines_added: 123,
          total_lines_removed: 45
        }
      }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('\x1b[36m'); // Cyan (custom added color)
      expect(result).to.include('\x1b[35m'); // Magenta (custom removed color)
    });

    it('should use default gray color when no colors provided', async () => {
      const widget = new LinesWidget();
      await widget.update(createMockStdinData({
        cost: {
          total_cost_usd: 0.01,
          total_duration_ms: 0,
          total_api_duration_ms: 0,
          total_lines_added: 123,
          total_lines_removed: 45
        }
      }));

      const result = await widget.render({ width: 80, timestamp: 0 });

      expect(result).to.include('\x1b[90m'); // Gray (default)
    });
  });
});
