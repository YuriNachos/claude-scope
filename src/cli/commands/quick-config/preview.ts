/**
 * Live preview renderer
 * Renders all widgets (sans Poker) with given style and theme
 */

import { Renderer } from "../../../core/renderer.js";
import { WidgetRegistry } from "../../../core/widget-registry.js";
import { TranscriptProvider } from "../../../providers/transcript-provider.js";
import { getThemeByName } from "../../../ui/theme/index.js";
import { ActiveToolsWidget } from "../../../widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../../../widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../../../widgets/config-count-widget.js";
import { ContextWidget } from "../../../widgets/context-widget.js";
import { CostWidget } from "../../../widgets/cost-widget.js";
import { DurationWidget } from "../../../widgets/duration-widget.js";
import { GitTagWidget } from "../../../widgets/git/git-tag-widget.js";
import { GitWidget } from "../../../widgets/git/git-widget.js";
import { LinesWidget } from "../../../widgets/lines-widget.js";
import { ModelWidget } from "../../../widgets/model-widget.js";
import type { QuickConfigStyle } from "./config-schema.js";
import { createDemoData } from "./demo-data.js";

/**
 * Render preview with given style and theme
 * @returns Multi-line string output
 */
export async function renderPreview(style: QuickConfigStyle, themeName: string): Promise<string> {
  // Get theme colors
  const theme = getThemeByName(themeName);

  // Create registry
  const registry = new WidgetRegistry();

  // Create transcript provider for ActiveToolsWidget
  const transcriptProvider = new TranscriptProvider();

  // Register all widgets except Poker
  const modelWidget = new ModelWidget(theme.colors);
  modelWidget.setStyle(style);
  await registry.register(modelWidget);

  const contextWidget = new ContextWidget(theme.colors);
  contextWidget.setStyle(style);
  await registry.register(contextWidget);

  const costWidget = new CostWidget(theme.colors);
  costWidget.setStyle(style);
  await registry.register(costWidget);

  const linesWidget = new LinesWidget(theme.colors);
  linesWidget.setStyle(style);
  await registry.register(linesWidget);

  const durationWidget = new DurationWidget(theme.colors);
  durationWidget.setStyle(style);
  await registry.register(durationWidget);

  const gitWidget = new GitWidget(undefined, theme.colors);
  gitWidget.setStyle(style);
  await registry.register(gitWidget);

  const gitTagWidget = new GitTagWidget(undefined, theme.colors);
  gitTagWidget.setStyle(style);
  await registry.register(gitTagWidget);

  const configCountWidget = new ConfigCountWidget();
  configCountWidget.setStyle(style);
  await registry.register(configCountWidget);

  const activeToolsWidget = new ActiveToolsWidget(theme.colors, transcriptProvider);
  activeToolsWidget.setStyle(style);
  await registry.register(activeToolsWidget);

  const cacheMetricsWidget = new CacheMetricsWidget(theme.colors);
  cacheMetricsWidget.setStyle(style);
  await registry.register(cacheMetricsWidget);

  // Create renderer
  const renderer = new Renderer({
    separator: " │ ",
    onError: () => {}, // Suppress errors in preview
    showErrors: false,
  });

  // Update all widgets with demo data
  const demoData = createDemoData();
  for (const widget of registry.getAll()) {
    await widget.update(demoData);
  }

  // Render
  const lines = await renderer.render(registry.getEnabledWidgets(), {
    width: 80,
    timestamp: Date.now(),
  });

  return lines.join("\n");
}
