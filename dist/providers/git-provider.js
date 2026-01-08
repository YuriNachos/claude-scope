/**
 * Git provider interface and implementation
 *
 * Uses native Node.js child_process to execute git commands,
 * avoiding external dependencies like simple-git.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
/**
 * Native git implementation using child_process
 *
 * Executes real git commands on the system.
 * Requires git to be installed and available in PATH.
 */
export class NativeGit {
    cwd;
    constructor(cwd) {
        this.cwd = cwd;
    }
    async status() {
        try {
            const { stdout } = await execFileAsync("git", ["status", "--branch", "--short"], {
                cwd: this.cwd,
            });
            // Parse output like: "## main" or "## feature-branch"
            const match = stdout.match(/^##\s+(\S+)/m);
            const current = match ? match[1] : null;
            return { current };
        }
        catch {
            // Not in a git repo or git not available
            return { current: null };
        }
    }
    async diffSummary(options) {
        const args = ["diff", "--shortstat"];
        if (options) {
            args.push(...options);
        }
        try {
            const { stdout } = await execFileAsync("git", args, {
                cwd: this.cwd,
            });
            // Parse output like: " 5 file(s) changed, 12 insertions(+), 3 deletions(-)"
            // or: " 2 insertions(+), 1 deletion(-)"
            const fileMatch = stdout.match(/(\d+)\s+file(s?)\s+changed/);
            const insertionMatch = stdout.match(/(\d+)\s+insertion/);
            const deletionMatch = stdout.match(/(\d+)\s+deletion/);
            const fileCount = fileMatch ? parseInt(fileMatch[1], 10) : 0;
            const insertions = insertionMatch ? parseInt(insertionMatch[1], 10) : 0;
            const deletions = deletionMatch ? parseInt(deletionMatch[1], 10) : 0;
            // Return a single "file" entry representing total changes
            // This matches the simple-git behavior we had before
            const files = insertions > 0 || deletions > 0 ? [{ file: "(total)", insertions, deletions }] : [];
            return { fileCount, files };
        }
        catch {
            // Not in a git repo or git not available
            return { fileCount: 0, files: [] };
        }
    }
    async latestTag() {
        try {
            const { stdout } = await execFileAsync("git", ["describe", "--tags", "--abbrev=0"], {
                cwd: this.cwd,
            });
            return stdout.trim();
        }
        catch {
            // No tags found or not in a git repo
            return null;
        }
    }
}
/**
 * Factory function to create NativeGit instance
 *
 * @param cwd - Working directory for git operations
 * @returns IGit instance
 */
export function createGit(cwd) {
    return new NativeGit(cwd);
}
//# sourceMappingURL=git-provider.js.map