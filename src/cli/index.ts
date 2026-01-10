/**
 * CLI Router
 * Routes commands based on process.argv
 */

import { handleQuickConfigCommand } from "./commands/quick-config/index.js";

export type CliCommand = "stdin" | "quick-config";

/**
 * Parse command from argv
 * @returns Command type or 'stdin' as default
 */
export function parseCommand(): CliCommand {
  const args = process.argv.slice(2);

  if (args[0] === "quick-config") {
    return "quick-config";
  }

  // Default: stdin mode (current behavior)
  return "stdin";
}

/**
 * Route to appropriate handler
 */
export async function routeCommand(command: CliCommand): Promise<void> {
  switch (command) {
    case "quick-config":
      await handleQuickConfigCommand();
      break;
    case "stdin":
      // Handled by main()
      throw new Error("stdin mode should be handled by main()");
    default: {
      const _exhaustive: never = command;
      return _exhaustive;
    }
  }
}
