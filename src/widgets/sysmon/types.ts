/**
 * System monitoring widget types
 */

/**
 * Render data for system monitoring display
 */
export interface SysmonRenderData {
  /** CPU usage metrics */
  cpu: CpuMetrics;
  /** Memory usage metrics */
  memory: MemoryMetrics;
  /** Disk usage metrics */
  disk: DiskMetrics;
  /** Network throughput metrics */
  network: NetworkMetrics;
}

/**
 * CPU usage metrics
 */
export interface CpuMetrics {
  /** CPU usage percentage (0-100) */
  percent: number;
}

/**
 * Memory usage metrics
 */
export interface MemoryMetrics {
  /** Used memory in GB */
  used: number;
  /** Total memory in GB */
  total: number;
  /** Memory usage percentage (0-100) */
  percent: number;
}

/**
 * Disk usage metrics
 */
export interface DiskMetrics {
  /** Used disk space in GB */
  used: number;
  /** Total disk space in GB */
  total: number;
  /** Disk usage percentage (0-100) */
  percent: number;
}

/**
 * Network throughput metrics
 */
export interface NetworkMetrics {
  /** Received data in MB/s */
  rxSec: number;
  /** Transmitted data in MB/s */
  txSec: number;
}
