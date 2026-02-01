/**
 * Install Command
 * Automatically configures Claude Code to use claude-scope as statusline
 * Then launches quick-config for immediate customization
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { runQuickConfigMenu } from "../quick-config/menu.js";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

/**
 * Claude Code settings.json structure
 */
interface ClaudeSettings {
  statusLine?: {
    type: string;
    command: string;
    padding?: number;
  };
  [key: string]: unknown;
}

/**
 * Get path to Claude Code settings.json
 */
function getClaudeSettingsPath(): string {
  return path.join(os.homedir(), ".claude", "settings.json");
}

/**
 * Read existing Claude settings or return empty object
 */
function readClaudeSettings(settingsPath: string): ClaudeSettings {
  try {
    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, "utf-8");
      return JSON.parse(content) as ClaudeSettings;
    }
  } catch {
    // If file doesn't exist or is invalid, return empty object
  }
  return {};
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Format JSON with 2-space indentation
 */
function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

/**
 * Print styled message
 */
function print(message: string): void {
  console.log(message);
}

/**
 * Handle install command
 */
export async function handleInstallCommand(): Promise<void> {
  const settingsPath = getClaudeSettingsPath();
  const claudeDir = path.dirname(settingsPath);

  print("");
  print(`${colors.bold}${colors.cyan}claude-scope${colors.reset} installer`);
  print(`${colors.dim}─────────────────────────────────${colors.reset}`);
  print("");

  // Step 1: Ensure .claude directory exists
  ensureDir(claudeDir);

  // Step 2: Read existing settings
  const settings = readClaudeSettings(settingsPath);
  const hadExistingStatusLine = !!settings.statusLine;

  // Step 3: Update statusLine config
  settings.statusLine = {
    type: "command",
    command: "npx -y claude-scope@latest",
    padding: 0,
  };

  // Step 4: Write settings back
  try {
    fs.writeFileSync(settingsPath, formatJson(settings), "utf-8");
  } catch (error) {
    print(`${colors.yellow}Error:${colors.reset} Failed to write settings.json`);
    print(`${colors.dim}${error instanceof Error ? error.message : String(error)}${colors.reset}`);
    process.exit(1);
  }

  // Step 5: Show success message
  if (hadExistingStatusLine) {
    print(
      `${colors.green}✓${colors.reset} Updated statusLine in ${colors.dim}${settingsPath}${colors.reset}`
    );
  } else {
    print(
      `${colors.green}✓${colors.reset} Added statusLine to ${colors.dim}${settingsPath}${colors.reset}`
    );
  }
  print("");

  // Step 6: Launch quick-config for immediate customization
  print(`${colors.bold}Now let's customize your statusline:${colors.reset}`);
  print("");

  await runQuickConfigMenu();

  // Final message
  print("");
  print(`${colors.green}✓${colors.reset} Installation complete!`);
  print(`${colors.dim}Restart Claude Code to see your new statusline.${colors.reset}`);
  print("");
}
