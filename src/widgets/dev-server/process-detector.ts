/**
 * Process Detector for Dev Server Widget
 *
 * Extracted from DevServerWidget for better separation of concerns.
 * Detects running dev servers by parsing system process list.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface ProcessPattern {
  regex: RegExp;
  name: string;
  icon: string;
}

export interface DetectedServer {
  name: string;
  icon: string;
  isRunning: boolean;
  isBuilding: boolean;
}

/**
 * Result of execFile command
 */
interface ExecFileResult {
  stdout: string;
  stderr?: string;
}

/**
 * Function signature for execFile (for dependency injection in tests)
 */
export type ExecFileFn = (
  command: string,
  args: string[],
  options?: { timeout?: number }
) => Promise<ExecFileResult>;

/**
 * Process Detector
 *
 * Uses ps aux to detect dev server processes by command pattern matching.
 */
export class ProcessDetector {
  private execFn: ExecFileFn;

  private readonly processPatterns: ProcessPattern[] = [
    // Generic server patterns - more specific to avoid shell history false positives
    { regex: /^[\w\s]+\/npm\s+(exec|run)\s+serve/i, name: "Server", icon: "🌐" },
    { regex: /^[\w\s]+\/npx\s+serve\s+-/i, name: "Server", icon: "🌐" },
    { regex: /^[\w\s]+\/(python|python3)\s+-m\s+http\.server/i, name: "HTTP", icon: "🌐" },
    // Generic dev/build patterns - require full command path
    { regex: /^[\w\s]+\/(npm|yarn|pnpm|bun)\s+run\s+dev\s*$/i, name: "Dev", icon: "🚀" },
    { regex: /^[\w\s]+\/(npm|yarn|pnpm|bun)\s+run\s+build\s*$/i, name: "Build", icon: "🔨" },
    // Framework-specific patterns - require executable path
    { regex: /\/(nuxt|next|astro|remix|svelte)\s+dev/i, name: "Framework", icon: "⚡" },
    { regex: /\/node.*\/vite\s*$/i, name: "Vite", icon: "⚡" },
    // Fallback: simpler patterns but checked last
    { regex: /\s(nuxt|next|vite)\s+dev\s/i, name: "DevServer", icon: "⚡" },
  ];

  /**
   * Create a new ProcessDetector
   * @param execFn - Optional execFile function for testing (dependency injection)
   */
  constructor(execFn?: ExecFileFn) {
    this.execFn = execFn ?? execFileAsync;
  }

  /**
   * Detect running dev server by parsing system process list
   * @returns Detected server status or null
   */
  async detect(): Promise<DetectedServer | null> {
    try {
      const { stdout } = await this.execFn("ps", ["aux"], {
        timeout: 1000,
      });

      for (const pattern of this.processPatterns) {
        if (pattern.regex.test(stdout)) {
          // Determine status based on pattern name
          const isBuilding = pattern.name.toLowerCase().includes("build");
          const isRunning = !isBuilding;

          return {
            name: pattern.name,
            icon: pattern.icon,
            isRunning,
            isBuilding,
          };
        }
      }
    } catch {
      // Process detection failed, return null
    }
    return null;
  }
}
