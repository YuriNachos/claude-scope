/**
 * Mock Transcript provider for testing and preview mode
 * Returns realistic demo tool data without accessing actual transcript files
 */
/**
 * Mock Transcript provider with hardcoded demo data
 *
 * Demo data represents typical Claude Code session:
 * - Mix of Read, Edit, Bash tools
 * - Some tools running, some completed
 * - Realistic targets (file paths, commands)
 */
export class MockTranscriptProvider {
    /**
     * Return demo tool entries
     * @param path - Transcript path (ignored in mock)
     * @returns Array of demo tool entries
     */
    async parseTools(_path) {
        const now = new Date();
        const minuteAgo = new Date(now.getTime() - 60 * 1000);
        return [
            {
                id: "tool_1",
                name: "Read",
                target: "src/config.ts",
                status: "completed",
                startTime: minuteAgo,
                endTime: minuteAgo,
            },
            {
                id: "tool_2",
                name: "Edit",
                target: "src/config.ts",
                status: "completed",
                startTime: minuteAgo,
                endTime: minuteAgo,
            },
            {
                id: "tool_3",
                name: "Read",
                target: "src/widget.ts",
                status: "completed",
                startTime: minuteAgo,
                endTime: minuteAgo,
            },
            {
                id: "tool_4",
                name: "Bash",
                target: "npm test",
                status: "running",
                startTime: now,
            },
            {
                id: "tool_5",
                name: "Edit",
                target: "src/styles.ts",
                status: "completed",
                startTime: minuteAgo,
                endTime: minuteAgo,
            },
        ];
    }
}
//# sourceMappingURL=mock-transcript-provider.js.map