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
});
