/**
 * Mock data fixtures for testing
 */

import type { StdinData } from '../../src/types.js';

/**
 * Create mock StdinData with optional overrides
 */
export function createMockStdinData(overrides: Partial<StdinData> = {}): StdinData {
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

/**
 * Create mock IGit interface with optional overrides
 */
import type { IGit } from '../../src/providers/git-provider.js';

export function createMockGit(overrides: Partial<IGit> = {}): IGit {
  return {
    checkIsRepo: async () => true,
    branch: async () => ({ current: 'main', all: ['main'] }),
    diffStats: async () => ({ insertions: 42, deletions: 10 }),
    ...overrides
  };
}
