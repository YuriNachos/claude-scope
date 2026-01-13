/**
 * Demo data for live preview
 * Realistic StdinData for rendering widget previews
 */

import { DEMO_DATA } from "../../../constants.js";
import type { ISystemProvider } from "../../../providers/system-provider.js";
import type { StdinData } from "../../../types.js";
import type { SysmonRenderData } from "../../../widgets/sysmon/types.js";

/**
 * Generate demo StdinData with realistic values
 */
export function createDemoData(): StdinData {
  return {
    hook_event_name: "Status",
    session_id: "demo_session_20250111",
    transcript_path: "/Users/demo/.claude/projects/-Users-demo-claude-scope/session.jsonl",
    cwd: "/Users/demo/claude-scope",
    model: {
      id: "claude-opus-4-5-20251101",
      display_name: "Claude Opus 4.5",
    },
    workspace: {
      current_dir: "/Users/demo/claude-scope",
      project_dir: "/Users/demo/claude-scope",
    },
    version: "1.0.0",
    output_style: {
      name: "default",
    },
    cost: {
      total_cost_usd: DEMO_DATA.COST_USD,
      total_duration_ms: DEMO_DATA.DURATION_MS,
      total_api_duration_ms: DEMO_DATA.API_DURATION_MS,
      total_lines_added: DEMO_DATA.LINES_ADDED,
      total_lines_removed: DEMO_DATA.LINES_REMOVED,
    },
    context_window: {
      total_input_tokens: DEMO_DATA.TOTAL_INPUT_TOKENS,
      total_output_tokens: DEMO_DATA.TOTAL_OUTPUT_TOKENS,
      context_window_size: DEMO_DATA.CONTEXT_WINDOW_SIZE,
      current_usage: {
        input_tokens: DEMO_DATA.CURRENT_INPUT_TOKENS,
        output_tokens: DEMO_DATA.CURRENT_OUTPUT_TOKENS,
        cache_creation_input_tokens: DEMO_DATA.CACHE_CREATION_TOKENS,
        cache_read_input_tokens: DEMO_DATA.CACHE_READ_TOKENS,
      },
    },
  };
}

/**
 * Create mock system provider with demo metrics
 */
export function createMockSystemProvider(): ISystemProvider {
  const demoMetrics: SysmonRenderData = {
    cpu: { percent: 42 },
    memory: { used: 8.2, total: 16, percent: 51 },
    disk: { used: 120, total: 256, percent: 47 },
    network: { rxSec: 2.4, txSec: 0.8 },
  };

  return {
    getMetrics: async () => demoMetrics,
    startUpdate: () => {},
    stopUpdate: () => {},
  };
}
