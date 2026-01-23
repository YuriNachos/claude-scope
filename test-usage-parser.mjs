import { UsageParser } from './dist/providers/usage-parser.js';
import { CacheMetricsWidget } from './dist/widgets/cache-metrics/cache-metrics-widget.js';

async function test() {
  const parser = new UsageParser();
  const widget = new CacheMetricsWidget();

  const testData = {
    hook_event_name: 'Status',
    session_id: '2e479809-3c2e-4041-a970-8b6bcfbfa2af',
    transcript_path: '/Users/yurii.chukhlib/.claude/projects/-Users-yurii-chukhlib-Documents-claude-scope/2e479809-3c2e-4041-a970-8b6bcfbfa2af.jsonl',
    cwd: '/tmp',
    model: { id: 'test', display_name: 'Test' },
    workspace: { current_dir: '/tmp', project_dir: '/tmp' },
    version: '1.0.0',
    output_style: { name: 'default' },
    cost: {},
    context_window: {
      total_input_tokens: 1000,
      total_output_tokens: 100,
      context_window_size: 200000,
      current_usage: null
    }
  };

  console.log('Testing UsageParser...');
  const parsed = await parser.parseLastUsage(testData.transcript_path);
  console.log('Parsed usage:', JSON.stringify(parsed, null, 2));

  console.log('\nTesting CacheMetricsWidget...');
  await widget.update(testData);
  console.log('Widget updated');

  const rendered = await widget.render({ width: 80, timestamp: Date.now() });
  console.log('Rendered:', rendered);

  // Check cachedUsage
  console.log('\nChecking widget state...');
  console.log('cachedUsage:', widget.cachedUsage);
}

test().catch(console.error);
