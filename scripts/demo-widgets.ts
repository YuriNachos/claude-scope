#!/usr/bin/env tsx
/**
 * Widget Demo Script
 *
 * Displays all available widgets with demo data in the terminal.
 * Uses cyberpunk-neon theme for vibrant, colorful output.
 */

import { ModelWidget } from "../src/widgets/model-widget.js";
import { ContextWidget } from "../src/widgets/context-widget.js";
import { CostWidget } from "../src/widgets/cost-widget.js";
import { LinesWidget } from "../src/widgets/lines-widget.js";
import { DurationWidget } from "../src/widgets/duration-widget.js";
import { CYBERPUNK_NEON_THEME } from "../src/ui/theme/themes/cyberpunk-neon-theme.js";
import type { StdinData } from "../src/types.js";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[38;2;0;191;255m";
const MAGENTA = "\x1b[38;2;255;0;122m";

const theme = CYBERPUNK_NEON_THEME.colors;

const demoStdinData: StdinData = {
  session_id: "demo-session-123",
  model: {
    id: "claude-opus-4-5-20250112",
    display_name: "Claude Opus 4.5",
  },
  context_window: {
    context_window_size: 200000,
    current_usage: {
      input_tokens: 45000,
      output_tokens: 12000,
      cache_creation_input_tokens: 5000,
      cache_read_input_tokens: 25000,
    },
  },
  cost: {
    total_cost_usd: 0.42,
    total_duration_ms: 185000,
  },
  lines: {
    added: 127,
    removed: 43,
  },
  cwd: "/Users/demo/claude-scope",
};

async function main(): Promise<void> {
  console.clear();
  console.log(`${BOLD}${CYAN}
╔═══════════════════════════════════════════════════════════════╗
║                  Widget Gallery Demo                          ║
║                  Theme: Cyberpunk Neon                         ║
╚═══════════════════════════════════════════════════════════════╝
${RESET}`);

  // 1. Model Widget
  console.log(`\n${BOLD}${MAGENTA}1. Model Widget${RESET}`);
  const modelWidget = new ModelWidget(theme);
  modelWidget.setStyle("balanced");
  await modelWidget.update(demoStdinData);
  console.log(await modelWidget.render({}) ?? "No output");

  // 2. Context Widget
  console.log(`\n${BOLD}${MAGENTA}2. Context Widget${RESET}`);
  const contextWidget = new ContextWidget(theme);
  contextWidget.setStyle("balanced");
  await contextWidget.update(demoStdinData);
  console.log(await contextWidget.render({}) ?? "No output");

  // 3. Cost Widget
  console.log(`\n${BOLD}${MAGENTA}3. Cost Widget${RESET}`);
  const costWidget = new CostWidget(theme);
  costWidget.setStyle("balanced");
  await costWidget.update(demoStdinData);
  console.log(await costWidget.render({}) ?? "No output");

  // 4. Lines Widget
  console.log(`\n${BOLD}${MAGENTA}4. Lines Widget${RESET}`);
  const linesWidget = new LinesWidget(theme);
  linesWidget.setStyle("balanced");
  await linesWidget.update(demoStdinData);
  console.log(await linesWidget.render({}) ?? "No output");

  // 5. Duration Widget
  console.log(`\n${BOLD}${MAGENTA}5. Duration Widget${RESET}`);
  const durationWidget = new DurationWidget(theme);
  durationWidget.setStyle("balanced");
  await durationWidget.update(demoStdinData);
  console.log(await durationWidget.render({}) ?? "No output");

  // 6. Git Widget
  console.log(`\n${BOLD}${MAGENTA}6. Git Widget${RESET}`);
  console.log(`${theme.git.branch}main [+127 -43]${RESET}`);

  // 7. Git Tag Widget
  console.log(`\n${BOLD}${MAGENTA}7. Git Tag Widget${RESET}`);
  console.log(`${theme.git.branch}v0.8.14${RESET}`);

  // 8. Config Count Widget
  console.log(`\n${BOLD}${MAGENTA}8. Config Count Widget${RESET}`);
  const { configCountStyles } = await import("../src/widgets/config-count/styles.js");
  console.log(configCountStyles.balanced!({
    claudeMdCount: 1,
    rulesCount: 3,
    mcpCount: 5,
    hooksCount: 2,
  }, theme) ?? "No output");

  // 9. Cache Metrics Widget
  console.log(`\n${BOLD}${MAGENTA}9. Cache Metrics Widget${RESET}`);
  const { cacheMetricsStyles } = await import("../src/widgets/cache-metrics/styles.js");
  console.log(cacheMetricsStyles.balanced!({
    cacheRead: 35000,
    cacheWrite: 5000,
    hitRate: 85,
    savings: 0.03,
  }, theme) ?? "No output");

  // 10. Active Tools Widget
  console.log(`\n${BOLD}${MAGENTA}10. Active Tools Widget${RESET}`);
  const { activeToolsStyles } = await import("../src/widgets/active-tools/styles.js");
  console.log(activeToolsStyles.balanced!({
    running: [
      { name: "Read", target: "/src/widgets/model-widget.ts" },
      { name: "Edit", target: "/src/widgets/context-widget.ts" },
    ],
    completed: [
      ["Bash", 3],
      ["Grep", 5],
      ["Read", 8],
    ],
  }, theme) ?? "No output");

  // 11. Dev Server Widget
  console.log(`\n${BOLD}${MAGENTA}11. Dev Server Widget${RESET}`);
  const { devServerStyles } = await import("../src/widgets/dev-server/styles.js");
  console.log(devServerStyles.balanced!({
    server: {
      name: "Vite",
      icon: "⚡",
      isRunning: true,
      isBuilding: false,
    },
  }, theme.devServer) ?? "No output");

  // 12. Docker Widget
  console.log(`\n${BOLD}${MAGENTA}12. Docker Widget${RESET}`);
  const { dockerStyles } = await import("../src/widgets/docker/styles.js");
  console.log(dockerStyles.balanced!({
    status: {
      running: 3,
      total: 5,
      isAvailable: true,
    },
  }, theme.docker) ?? "No output");

  // 13. Poker Widget (Bonus)
  console.log(`\n${BOLD}${MAGENTA}13. Poker Widget (Bonus)${RESET}`);
  console.log(`${theme.semantic.info}Hand:${RESET} ${theme.poker.participating}(A♠)${RESET} ${theme.poker.nonParticipating}K♦${RESET} | ${theme.semantic.info}Board:${RESET} ${theme.poker.participating}(Q♠)${RESET} ${theme.poker.nonParticipating}J♦ 10♠ 5♥ 2♣${RESET} → ${theme.poker.result}Royal Flush! 👑${RESET}`);

  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BOLD}${MAGENTA}  All 13 Widgets Demo Complete!${RESET}`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

  // ═══════════════════════════════════════════════════════════════
  // LIVE PREVIEW: How widgets look together in real usage
  // ═══════════════════════════════════════════════════════════════

  // Import all styles needed for live preview
  const [modelStylesModule, contextStylesModule, linesStylesModule, costStylesModule, durationStylesModule, gitStylesModule, gitTagStylesModule] = await Promise.all([
    import("../src/widgets/model/styles.js"),
    import("../src/widgets/context/styles.js"),
    import("../src/widgets/lines/styles.js"),
    import("../src/widgets/cost/styles.js"),
    import("../src/widgets/duration/styles.js"),
    import("../src/widgets/git/styles.js"),
    import("../src/widgets/git-tag/styles.js"),
  ]);

  const modelStyles = modelStylesModule.modelStyles;
  const contextStyles = contextStylesModule.contextStyles;
  const linesStyles = linesStylesModule.linesStyles;
  const costStyles = costStylesModule.costStyles;
  const durationStyles = durationStylesModule.durationStyles;
  const gitStyles = gitStylesModule.gitStyles;
  const gitTagStyles = gitTagStylesModule.gitTagStyles;

  // ═══════════════════════════════════════════════════════════════
  // PREVIEW PAIR 1: 2 rows (Model|Context|Lines|Cost|Duration + Git|GitTag|Cache|Config)
  // ═══════════════════════════════════════════════════════════════

  // VARIANT 1A: Balanced Style
  console.log(`${BOLD}${CYAN}
╔═══════════════════════════════════════════════════════════════╗
║      PREVIEW 1A: Balanced (2 rows)                            ║
╚═══════════════════════════════════════════════════════════════╝${RESET}`);

  const sep = `${theme.base.muted} │ ${RESET}`;

  // Row 1: Model | Context | Lines | Cost | Duration
  const row1Balanced = [
    modelStyles.balanced!({ displayName: "Claude Opus 4.5", id: "claude-opus-4-5" }, theme.model),
    contextStyles.balanced!({ used: 87000, contextWindowSize: 200000, percent: 44 }, theme.context),
    linesStyles.balanced!({ added: 127, removed: 43 }, theme.lines),
    costStyles.balanced!({ costUsd: 0.42 }, theme.cost),
    durationStyles.balanced!({ durationMs: 185000 }, theme.duration),
  ].join(sep);

  console.log(`\n${row1Balanced}`);

  // Row 2: Git | Git Tag | Cache Metrics | Config Count
  const row2Balanced = [
    gitStyles.balanced!({ branch: "main", changes: { files: 5, insertions: 127, deletions: 43 } }, theme.git),
    gitTagStyles.balanced!({ tag: "v0.8.14" }, theme.git),
    cacheMetricsStyles.balanced!({ cacheRead: 35000, cacheWrite: 5000, hitRate: 85, savings: 0.03 }, theme),
    configCountStyles.balanced!({ claudeMdCount: 1, rulesCount: 3, mcpCount: 5, hooksCount: 2 }, theme),
  ].join(sep);

  console.log(`${row2Balanced}`);

  // VARIANT 1B: Playful Style (with emojis)
  console.log(`\n${BOLD}${MAGENTA}
╔═══════════════════════════════════════════════════════════════╗
║      PREVIEW 1B: Playful with emojis (2 rows)                 ║
╚═══════════════════════════════════════════════════════════════╝${RESET}`);

  // Row 1: Model | Context | Lines | Cost | Duration (playful)
  const row1Playful = [
    modelStyles.playful!({ displayName: "Claude Opus 4.5", id: "claude-opus-4-5" }, theme.model),
    contextStyles.playful!({ used: 87000, contextWindowSize: 200000, percent: 44 }, theme.context),
    linesStyles.playful!({ added: 127, removed: 43 }, theme.lines),
    costStyles.playful!({ costUsd: 0.42 }, theme.cost),
    durationStyles.playful!({ durationMs: 185000 }, theme.duration),
  ].join(sep);

  console.log(`\n${row1Playful}`);

  // Row 2: Git | Git Tag | Cache Metrics | Config Count (playful)
  const row2Playful = [
    gitStyles.playful!({ branch: "main", changes: { files: 5, insertions: 127, deletions: 43 } }, theme.git),
    gitTagStyles.playful!({ tag: "v0.8.14" }, theme.git),
    cacheMetricsStyles.playful!({ cacheRead: 35000, cacheWrite: 5000, hitRate: 85, savings: 0.03 }, theme),
    configCountStyles.playful!({ claudeMdCount: 1, rulesCount: 3, mcpCount: 5, hooksCount: 2 }, theme),
  ].join(sep);

  console.log(`${row2Playful}\n`);

  // ═══════════════════════════════════════════════════════════════
  // PREVIEW PAIR 2: 1 row (Model|Context|Cost|Git|Duration)
  // ═══════════════════════════════════════════════════════════════

  // VARIANT 2A: Balanced Style (single row)
  console.log(`${BOLD}${CYAN}
╔═══════════════════════════════════════════════════════════════╗
║      PREVIEW 2A: Balanced (1 row)                             ║
╚═══════════════════════════════════════════════════════════════╝${RESET}`);

  const singleRowBalanced = [
    modelStyles.balanced!({ displayName: "Claude Opus 4.5", id: "claude-opus-4-5" }, theme.model),
    contextStyles.balanced!({ used: 87000, contextWindowSize: 200000, percent: 44 }, theme.context),
    costStyles.balanced!({ costUsd: 0.42 }, theme.cost),
    gitStyles.balanced!({ branch: "main", changes: { files: 5, insertions: 127, deletions: 43 } }, theme.git),
    durationStyles.balanced!({ durationMs: 185000 }, theme.duration),
  ].join(sep);

  console.log(`\n${singleRowBalanced}`);

  // VARIANT 2B: Playful Style (single row with emojis)
  console.log(`\n${BOLD}${MAGENTA}
╔═══════════════════════════════════════════════════════════════╗
║      PREVIEW 2B: Playful with emojis (1 row)                  ║
╚═══════════════════════════════════════════════════════════════╝${RESET}`);

  const singleRowPlayful = [
    modelStyles.playful!({ displayName: "Claude Opus 4.5", id: "claude-opus-4-5" }, theme.model),
    contextStyles.playful!({ used: 87000, contextWindowSize: 200000, percent: 44 }, theme.context),
    costStyles.playful!({ costUsd: 0.42 }, theme.cost),
    gitStyles.playful!({ branch: "main", changes: { files: 5, insertions: 127, deletions: 43 } }, theme.git),
    durationStyles.playful!({ durationMs: 185000 }, theme.duration),
  ].join(sep);

  console.log(`\n${singleRowPlayful}\n`);

  // ═══════════════════════════════════════════════════════════════
  // PREVIEW PAIR 3: 3 rows (adds Dev Server|Docker|Active Tools to Pair 1)
  // ═══════════════════════════════════════════════════════════════

  // VARIANT 3A: Balanced Style (3 rows)
  console.log(`${BOLD}${CYAN}
╔═══════════════════════════════════════════════════════════════╗
║      PREVIEW 3A: Balanced (3 rows)                            ║
╚═══════════════════════════════════════════════════════════════╝${RESET}`);

  // Row 1: Model | Context | Lines | Cost | Duration
  console.log(`\n${row1Balanced}`);
  // Row 2: Git | Git Tag | Cache Metrics | Config Count
  console.log(`${row2Balanced}`);

  // Row 3: Dev Server | Docker | Active Tools
  const row3Balanced = [
    devServerStyles.balanced!({ server: { name: "Vite", icon: "⚡", isRunning: true, isBuilding: false } }, theme.devServer),
    dockerStyles.balanced!({ status: { running: 3, total: 5, isAvailable: true } }, theme.docker),
    activeToolsStyles.balanced!({
      running: [{ name: "Read", target: "/src/widgets/model-widget.ts" }],
      completed: [["Bash", 3], ["Read", 5]],
    }, theme),
  ].join(sep);

  console.log(`${row3Balanced}`);

  // VARIANT 3B: Playful Style (3 rows with emojis)
  console.log(`\n${BOLD}${MAGENTA}
╔═══════════════════════════════════════════════════════════════╗
║      PREVIEW 3B: Playful with emojis (3 rows)                 ║
╚═══════════════════════════════════════════════════════════════╝${RESET}`);

  // Row 1: Model | Context | Lines | Cost | Duration (playful)
  console.log(`\n${row1Playful}`);
  // Row 2: Git | Git Tag | Cache Metrics | Config Count (playful)
  console.log(`${row2Playful}`);

  // Row 3: Dev Server | Docker | Active Tools (playful)
  const row3Playful = [
    devServerStyles.playful!({ server: { name: "Vite", icon: "⚡", isRunning: true, isBuilding: false } }, theme.devServer),
    dockerStyles.playful!({ status: { running: 3, total: 5, isAvailable: true } }, theme.docker),
    activeToolsStyles.playful!({
      running: [{ name: "Read", target: "/src/widgets/model-widget.ts" }],
      completed: [["Bash", 3], ["Read", 5]],
    }, theme),
  ].join(sep);

  console.log(`${row3Playful}\n`);

  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
}

main().catch((error) => {
  console.error("Error running demo:", error);
  process.exit(1);
});
