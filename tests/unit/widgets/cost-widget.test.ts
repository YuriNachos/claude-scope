/**
 * Unit tests for CostWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { CostWidget } from '../../../src/widgets/cost-widget.js';
import type { StdinData } from '../../../src/types.js';

function createMockStdinData(overrides: Partial<StdinData> = {}): StdinData {
  return {
    hook_event_name: 'Status',
    session_id: 'test-session',
    transcript_path: '/test/transcript.json',
    cwd: '/test/project',
    model: { id: 'test-model', display_name: 'Test Model' },
    workspace: { current_dir: '/test/project', project_dir: '/test/project' },
    version: '1.0.0',
    output_style: { name: 'default' },
    cost: {
      total_cost_usd: 0.01,
      total_duration_ms: 60000,
      total_api_duration_ms: 5000,
      total_lines_added: 10,
      total_lines_removed: 5
    },
    context_window: {
      total_input_tokens: 1000,
      total_output_tokens: 500,
      context_window_size: 200000,
      current_usage: {
        input_tokens: 500,
        output_tokens: 250,
        cache_creation_input_tokens: 100,
        cache_read_input_tokens: 50
      }
    },
    ...overrides
  };
}

describe('CostWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new CostWidget();
    expect(widget.id).to.equal('cost');
    expect(widget.metadata.name).to.equal('Cost');
  });

  it('should format small cost (< $0.01)', async () => {
    const widget = new CostWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 0.0012, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('$0.0012');
  });

  it('should format normal cost ($0.01 - $100)', async () => {
    const widget = new CostWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 1.23, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('$1.23');
  });

  it('should format large cost (>= $100)', async () => {
    const widget = new CostWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 123.45, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('$123');
  });

  it('should handle zero cost', async () => {
    const widget = new CostWidget();
    await widget.update(createMockStdinData({ cost: { total_cost_usd: 0, total_duration_ms: 0, total_api_duration_ms: 0, total_lines_added: 0, total_lines_removed: 0 } }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('$0.0000');
  });
});
