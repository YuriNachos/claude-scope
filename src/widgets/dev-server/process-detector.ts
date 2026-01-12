/**
 * Process Detector for Dev Server Widget
 *
 * Extracted from DevServerWidget for better separation of concerns.
 * Detects running dev servers by parsing system process list.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { DetectedServer, ExecFileFn, ProcessPattern } from "./detector-types.js";

const execFileAsync = promisify(execFile);

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
          } satisfies DetectedServer;
        }
      }
    } catch {
      // Process detection failed, return null
    }
    return null;
  }
}
