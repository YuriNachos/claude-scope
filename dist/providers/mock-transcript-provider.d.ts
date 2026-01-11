/**
 * Mock Transcript provider for testing and preview mode
 * Returns realistic demo tool data without accessing actual transcript files
 */
import type { ITranscriptProvider } from "./transcript-provider.js";
import type { ToolEntry } from "./transcript-types.js";
/**
 * Mock Transcript provider with hardcoded demo data
 *
 * Demo data represents typical Claude Code session:
 * - Mix of Read, Edit, Bash tools
 * - Some tools running, some completed
 * - Realistic targets (file paths, commands)
 */
export declare class MockTranscriptProvider implements ITranscriptProvider {
    /**
     * Return demo tool entries
     * @param path - Transcript path (ignored in mock)
     * @returns Array of demo tool entries
     */
    parseTools(_path: string): Promise<ToolEntry[]>;
}
//# sourceMappingURL=mock-transcript-provider.d.ts.map