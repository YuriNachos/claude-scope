/**
 * Port Detector for Dev Server Widget
 *
 * Detects running development servers by checking listening ports using lsof.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface DetectedServer {
  name: string;
  icon: string;
  port: number;
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
 * Port to server mapping
 */
const PORT_MAPPING: Record<number, { name: string; icon: string }> = {
  5173: { name: "Vite", icon: "⚡" },
  4200: { name: "Angular", icon: "▲" },
  3000: { name: "Dev", icon: "🚀" },
  8080: { name: "Webpack", icon: "📦" },
  8000: { name: "Dev", icon: "🚀" },
  8888: { name: "Dev", icon: "🚀" },
};

/**
 * Common development server ports to check
 */
const DEV_PORTS = [5173, 4200, 3000, 8080, 8000, 8888];

/**
 * Port Detector
 *
 * Uses lsof to check if processes are listening on common dev server ports.
 */
export class PortDetector {
  private execFn: ExecFileFn;

  /**
   * Create a new PortDetector
   * @param execFn - Optional execFile function for testing (dependency injection)
   */
  constructor(execFn?: ExecFileFn) {
    this.execFn = execFn ?? execFileAsync;
  }

  /**
   * Detect running dev servers by checking listening ports
   * @returns Detected server info or null
   */
  async detect(): Promise<DetectedServer | null> {
    try {
      // Build lsof command to check all common dev ports
      const args = [
        "-nP", // No host names, no port names
        "-iTCP", // Internet TCP
        "-sTCP:LISTEN", // TCP LISTEN state only
      ];

      // Add each port to check
      for (const port of DEV_PORTS) {
        args.push("-i", `:${port}`);
      }

      const { stdout } = await this.execFn("lsof", args, {
        timeout: 2000,
      });

      // Parse lsof output format:
      // COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
      // node    12345 user   24u  IPv4  0x0      0t0  TCP *:5173 (LISTEN)

      const lines = stdout.trim().split("\n");
      for (const line of lines) {
        if (!line || line.startsWith("COMMAND")) continue;

        // Extract port from last column (e.g., "TCP *:5173 (LISTEN)")
        const match = line.match(/:(\d+)\s*\(LISTEN\)/);
        if (match) {
          const port = parseInt(match[1], 10);
          const mapping = PORT_MAPPING[port];

          if (mapping) {
            return {
              name: mapping.name,
              icon: mapping.icon,
              port,
              isRunning: true,
              isBuilding: false,
            };
          }
        }
      }

      return null;
    } catch {
      // lsof not available or no processes found
      return null;
    }
  }
}
