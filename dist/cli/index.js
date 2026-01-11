/**
 * CLI Router
 * Routes commands based on process.argv
 */
import { handleQuickConfigCommand } from "./commands/quick-config/index.js";
/**
 * Parse command from argv
 * @returns Command type or 'stdin' as default
 */
export function parseCommand() {
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
export async function routeCommand(command) {
    switch (command) {
        case "quick-config":
            await handleQuickConfigCommand();
            break;
        case "stdin":
            // Handled by main()
            throw new Error("stdin mode should be handled by main()");
        default: {
            const _exhaustive = command;
            return _exhaustive;
        }
    }
}
//# sourceMappingURL=index.js.map