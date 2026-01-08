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

  describe('style renderers', () => {
    const testAdded = 142;
    const testRemoved = 27;

    const createLinesData = (added: number, removed: number) => ({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: added,
        total_lines_removed: removed
      }
    });

    describe('balanced style', () => {
      it('should render with slash separator and colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('balanced');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('+142');
        expect(result).to.include('-27');
        expect(result).to.include('/');
      });
    });

    describe('compact style', () => {
      it('should render without separator and with colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('compact');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('+142');
        expect(result).to.include('-27');
      });
    });

    describe('playful style', () => {
      it('should render with emojis and colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('playful');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('➕142');
        expect(result).to.include('➖27');
      });
    });

    describe('verbose style', () => {
      it('should render with full text and colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('verbose');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('+142 added');
        expect(result).to.include('-27 removed');
      });
    });

    describe('labeled style', () => {
      it('should render with label prefix and colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('labeled');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('Lines:');
        expect(result).to.include('+142');
        expect(result).to.include('-27');
      });
    });

    describe('indicator style', () => {
      it('should render with bullet indicator and colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('indicator');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('●');
        expect(result).to.include('+142');
        expect(result).to.include('-27');
      });
    });

    describe('fancy style', () => {
      it('should render with angle brackets and colors', async () => {
        const widget = new LinesWidget();
        widget.setStyle('fancy');
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('⟨');
        expect(result).to.include('⟩');
        expect(result).to.include('+142');
        expect(result).to.include('-27');
      });
    });

    describe('style switching', () => {
      it('should switch between styles dynamically', async () => {
        const widget = new LinesWidget();
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        widget.setStyle('balanced');
        let result = await widget.render({ width: 80, timestamp: 0 });
        expect(result).to.include('+142');
        expect(result).to.include('/');

        widget.setStyle('compact');
        result = await widget.render({ width: 80, timestamp: 0 });
        expect(result).to.include('+142');
        expect(result).to.not.include('/');

        widget.setStyle('fancy');
        result = await widget.render({ width: 80, timestamp: 0 });
        expect(result).to.include('⟨');
      });

      it('should default to balanced for unknown styles', async () => {
        const widget = new LinesWidget();
        await widget.update(createMockStdinData(createLinesData(testAdded, testRemoved)));

        // @ts-expect-error - testing invalid style
        widget.setStyle('unknown' as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.include('+142');
        expect(result).to.include('-27');
      });
    });
  });
});
