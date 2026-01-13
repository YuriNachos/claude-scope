/**
 * System metrics for SysmonWidget
 */

export interface SystemMetrics {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  network: NetworkMetrics;
}

export interface CpuMetrics {
  percent: number;
}

export interface MemoryMetrics {
  used: number; // GB
  total: number; // GB
  percent: number; // 0-100
}

export interface DiskMetrics {
  used: number; // GB
  total: number; // GB
  percent: number; // 0-100
}

export interface NetworkMetrics {
  rx_sec: number; // MB/s received
  tx_sec: number; // MB/s sent
}
