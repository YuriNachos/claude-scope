/**
 * Types for DockerWidget
 */

/**
 * Docker container status
 */
export interface DockerStatus {
  /** Number of running containers */
  running: number;
  /** Total number of containers (including stopped) */
  total: number;
  /** Whether docker daemon is available */
  isAvailable: boolean;
}

/**
 * Render data for DockerWidget
 */
export interface DockerRenderData {
  /** Docker container status */
  status: DockerStatus;
}
