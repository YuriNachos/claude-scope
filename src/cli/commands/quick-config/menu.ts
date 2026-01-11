/**
 * Interactive menu component
 * Two-stage selection: style → theme
 */

import { confirm, select } from "@inquirer/prompts";
import { generateConfigWithStyleAndTheme } from "../../../config/default-config.js";
import { AVAILABLE_THEMES } from "../../../ui/theme/index.js";
import { loadConfig } from "./config-loader.js";
import type { QuickConfigStyle } from "./config-schema.js";
import { saveConfig } from "./config-writer.js";

/**
 * Theme choice interface for menu
 */
interface ThemeChoice {
  name: string;
  description: string;
  value: string;
}

/**
 * Show "Current vs Fresh" choice if config exists
 */
async function showCurrentOrFresh(): Promise<"current" | "fresh"> {
  const currentConfig = await loadConfig();

  if (!currentConfig) {
    return "fresh";
  }

  // Show current config preview
  console.log("\n=== Current Configuration ===");
  console.log("(Preview would render here with current config)");

  // Show fresh config preview
  console.log("\n=== Fresh Configuration ===");
  console.log("(Preview would render here with fresh defaults)");

  const choice = await confirm({
    message: "Use current configuration as starting point?",
    default: true,
  });

  return choice ? "current" : "fresh";
}

/**
 * Stage 1: Select display style
 */
async function selectStyle(): Promise<QuickConfigStyle> {
  const style = await select<QuickConfigStyle>({
    message: "Select display style (use arrow keys, Enter to select):",
    choices: [
      {
        name: "Balanced",
        value: "balanced",
        description: "Clean, balanced display with labels",
      },
      {
        name: "Playful",
        value: "playful",
        description: "Fun display with emojis",
      },
      {
        name: "Compact",
        value: "compact",
        description: "Minimal, condensed display",
      },
    ],
  });

  return style;
}

/**
 * Stage 2: Select theme
 */
async function selectTheme(_style: QuickConfigStyle): Promise<string> {
  const themeChoices: ThemeChoice[] = AVAILABLE_THEMES.map((theme) => ({
    name: theme.name,
    description: theme.description,
    value: theme.name,
  }));

  const theme = await select<string>({
    message: "Select theme (use arrow keys, Enter to select):",
    choices: themeChoices,
  });

  return theme;
}

/**
 * Run full quick config flow
 */
export async function runQuickConfigMenu(): Promise<void> {
  try {
    // Pre-check: current vs fresh
    const _startMode = await showCurrentOrFresh();

    // Stage 1: Select style
    const selectedStyle = await selectStyle();

    // Stage 2: Select theme
    const selectedTheme = await selectTheme(selectedStyle);

    // Generate and save config
    console.log("\nGenerating configuration...");
    const config = generateConfigWithStyleAndTheme(selectedStyle, selectedTheme);
    await saveConfig(config);

    console.log(`\n✓ Configuration saved to ~/.claude-scope/config.json`);
    console.log(`  Style: ${selectedStyle}`);
    console.log(`  Theme: ${selectedTheme}`);
  } catch (error) {
    // Handle user cancellation gracefully
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log("\n✓ Configuration cancelled. No changes saved.");
      process.exit(0);
    }

    // Handle permission denied errors
    if (error instanceof Error && (error as any).code === "EACCES") {
      console.error("\n✗ Permission denied. Cannot write to ~/.claude-scope/config.json");
      process.exit(1);
    }

    // Handle all other errors
    console.error("\n✗ Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
