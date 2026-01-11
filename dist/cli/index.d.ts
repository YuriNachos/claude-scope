/**
 * CLI Router
 * Routes commands based on process.argv
 */
export type CliCommand = "stdin" | "quick-config";
/**
 * Parse command from argv
 * @returns Command type or 'stdin' as default
 */
export declare function parseCommand(): CliCommand;
/**
 * Route to appropriate handler
 */
export declare function routeCommand(command: CliCommand): Promise<void>;
//# sourceMappingURL=index.d.ts.map