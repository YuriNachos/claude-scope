/**
 * Three-Stage Interactive Menu: Layout -> Style -> Theme
 */

import { select } from "@inquirer/prompts";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
} from "../../../config/default-config.js";
import { AVAILABLE_THEMES } from "../../../ui/theme/index.js";
import type { QuickConfigLayout, QuickConfigStyle, ScopeConfig } from "./config-schema.js";
import { saveConfig } from "./config-writer.js";
import { renderPreviewFromConfig } from "./layout-preview.js";

/**
 * Layout choice interface
 */
interface LayoutChoice {
  name: string;
  description: string;
  value: QuickConfigLayout;
}

/**
 * Style choice interface
 */
interface StyleChoice {
  name: string;
  description: string;
  value: QuickConfigStyle;
}

/**
 * Theme choice interface
 */
interface ThemeChoice {
  name: string;
  description: string;
  value: string;
}

/**
 * Get layout generator function by layout type
 */
function getLayoutGenerator(layout: QuickConfigLayout) {
  switch (layout) {
    case "balanced":
      return generateBalancedLayout;
    case "compact":
      return generateCompactLayout;
    case "rich":
      return generateRichLayout;
  }
}

/**
 * Stage 1: Select layout with live previews
 */
async function selectLayout(): Promise<QuickConfigLayout> {
  const layoutChoices: LayoutChoice[] = [
    {
      name: "Balanced",
      description: "2 lines: AI metrics + Git, Cache, Tools, MCP, Hooks",
      value: "balanced",
    },
    {
      name: "Compact",
      description: "1 line: Model, Context, Cost, Git, Duration",
      value: "compact",
    },
    {
      name: "Rich",
      description: "3 lines: Full details with Git Tag, Config Count",
      value: "rich",
    },
  ];

  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Stage 1/3: Choose Widget Layout                                  │");
  console.log("├─────────────────────────────────────────────────────────────────┤");
  console.log("│  Select how widgets are arranged across statusline lines.        │");
  console.log("│  Each option shows a live preview with demo data.               │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  const layout = await select<QuickConfigLayout>({
    message: "Choose a layout preset:",
    choices: layoutChoices,
    pageSize: 3,
  });

  return layout;
}

/**
 * Stage 2: Select style with layout-aware preview
 */
async function selectStyle(layout: QuickConfigLayout): Promise<QuickConfigStyle> {
  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Stage 2/3: Choose Display Style                                 │");
  console.log("├─────────────────────────────────────────────────────────────────┤");
  console.log("│  Select how widgets are rendered (labels, emojis, etc.).        │");
  console.log("│  Preview shows your selected layout with each style.            │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  const styleChoices: StyleChoice[] = [
    {
      name: "Balanced",
      description: "Clean, balanced display with labels",
      value: "balanced",
    },
    {
      name: "Playful",
      description: "Fun display with emojis",
      value: "playful",
    },
    {
      name: "Compact",
      description: "Minimal, condensed display",
      value: "compact",
    },
  ];

  const style = await select<QuickConfigStyle>({
    message: "Choose a display style:",
    choices: styleChoices,
  });

  return style;
}

/**
 * Stage 3: Select theme with layout + style aware preview
 */
async function selectTheme(layout: QuickConfigLayout, style: QuickConfigStyle): Promise<string> {
  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Stage 3/3: Choose Color Theme                                   │");
  console.log("├─────────────────────────────────────────────────────────────────┤");
  console.log("│  Select color theme for your statusline.                        │");
  console.log("│  Preview shows your final configuration with live colors.        │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  const themeChoices: ThemeChoice[] = AVAILABLE_THEMES.slice(0, 8).map((theme) => ({
    name: theme.name,
    description: theme.description,
    value: theme.name,
  }));

  const theme = await select<string>({
    message: "Choose a theme:",
    choices: themeChoices,
    pageSize: 8,
  });

  return theme;
}

/**
 * Show navigation hints
 */
function showNavigationHints(): void {
  console.log(
    "\n  Navigation: \u2191\u2193 arrows to move \u2022 Enter to select \u2022 Esc to exit"
  );
  console.log(
    "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"
  );
}

/**
 * Run full three-stage quick config flow
 */
export async function runQuickConfigMenu(): Promise<void> {
  try {
    // Stage 1: Select layout
    showNavigationHints();
    const selectedLayout = await selectLayout();

    // Stage 2: Select style
    showNavigationHints();
    const selectedStyle = await selectStyle(selectedLayout);

    // Stage 3: Select theme
    showNavigationHints();
    const selectedTheme = await selectTheme(selectedLayout, selectedStyle);

    // Generate and save config
    console.log("\nGenerating configuration...");

    const config = getLayoutGenerator(selectedLayout)(selectedStyle, selectedTheme);
    await saveConfig(config);

    console.log(`\u2713 Configuration saved to ~/.claude-scope/config.json`);
    console.log(`  Layout: ${selectedLayout}`);
    console.log(`  Style: ${selectedStyle}`);
    console.log(`  Theme: ${selectedTheme}`);
    console.log("\nPreview of your configuration:");
    console.log(
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"
    );
    const finalPreview = await renderPreviewFromConfig(config, selectedStyle, selectedTheme);
    console.log(finalPreview);
    console.log(
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"
    );
  } catch (error) {
    // Handle user cancellation gracefully
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log("\n\u2713 Configuration cancelled. No changes saved.");
      process.exit(0);
    }

    // Handle permission denied errors
    if (error instanceof Error && (error as any).code === "EACCES") {
      console.error("\u2717 Permission denied. Cannot write to ~/.claude-scope/config.json");
      process.exit(1);
    }

    // Handle all other errors
    console.error("\u2717 Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
