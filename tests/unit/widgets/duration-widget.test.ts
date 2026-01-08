/**
 * Unit tests for DurationWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { DurationWidget } from '../../../src/widgets/duration-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

describe('DurationWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new DurationWidget();
    expect(widget.id).to.equal('duration');
    expect(widget.metadata.name).to.equal('Duration');
  });

  it('should format seconds only', async () => {
    const widget = new DurationWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 0, total_duration_ms: 45000, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('45s');
  });

  it('should format minutes and seconds', async () => {
    const widget = new DurationWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 0, total_duration_ms: 90000, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('1m 30s');
  });

  it('should format hours, minutes, and seconds', async () => {
    const widget = new DurationWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 0, total_duration_ms: 3665000, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('1h 1m 5s');
  });

  it('should handle zero duration', async () => {
    const widget = new DurationWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 0, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('0s');
  });

  describe('style renderers', () => {
    const testDurationMs = 3665000; // 1h 1m 5s

    const createDurationData = (ms: number) => ({
      cost: {
        total_cost_usd: 0,
        total_duration_ms: ms,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0,
      },
    });

    describe('balanced style', () => {
      it('should render formatted duration', async () => {
        const widget = new DurationWidget();
        widget.setStyle('balanced');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('1h 1m 5s');
      });
    });

    describe('compact style', () => {
      it('should render hours and minutes only', async () => {
        const widget = new DurationWidget();
        widget.setStyle('compact');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('1h1m');
      });
    });

    describe('playful style', () => {
      it('should render with hourglass emoji', async () => {
        const widget = new DurationWidget();
        widget.setStyle('playful');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('⌛ 1h 1m');
      });
    });

    describe('technical style', () => {
      it('should render raw milliseconds', async () => {
        const widget = new DurationWidget();
        widget.setStyle('technical');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('3665000ms');
      });
    });

    describe('labeled style', () => {
      it('should render with label prefix', async () => {
        const widget = new DurationWidget();
        widget.setStyle('labeled');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('Time: 1h 1m 5s');
      });
    });

    describe('indicator style', () => {
      it('should render with bullet indicator', async () => {
        const widget = new DurationWidget();
        widget.setStyle('indicator');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('● 1h 1m 5s');
      });
    });

    describe('fancy style', () => {
      it('should render with angle brackets', async () => {
        const widget = new DurationWidget();
        widget.setStyle('fancy');
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('⟨1h 1m 5s⟩');
      });
    });

    describe('style switching', () => {
      it('should switch between styles dynamically', async () => {
        const widget = new DurationWidget();
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        widget.setStyle('balanced');
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal('1h 1m 5s');

        widget.setStyle('compact');
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal('1h1m');

        widget.setStyle('technical');
        expect(await widget.render({ width: 80, timestamp: 0 })).to.equal('3665000ms');
      });

      it('should default to balanced for unknown styles', async () => {
        const widget = new DurationWidget();
        await widget.update(createMockStdinData(createDurationData(testDurationMs)));

        // @ts-expect-error - testing invalid style
        widget.setStyle('unknown' as any);
        const result = await widget.render({ width: 80, timestamp: 0 });

        expect(result).to.equal('1h 1m 5s');
      });
    });
  });
});
